import './scss/styles.scss';
import { WebLarekApi } from "./components/connector/WebLarekApi";
import { API_URL, CDN_URL } from "./utils/constants";
import { EventEmitter } from "./components/base/events";
import { AppState } from './components/model/AppState';
import { CardUI } from './components/view/CardUI';
import { ensureElement, cloneTemplate } from './utils/utils';
import { PageUI } from './components/view/PageUI';
import { IProduct } from './types';
import { PopupUI } from './components/view/PopupUI';
import { BasketUI } from './components/view/BasketUI';
import { OrderUI } from './components/view/OrderUI';
import { ContactsUI } from './components/view/ContactsUI';
import { SuccessUI } from './components/view/SuccessUI';

const events = new EventEmitter();
const api = new WebLarekApi(CDN_URL, API_URL);

// шаблоны
const cardCatalogTemplate = ensureElement<HTMLTemplateElement>('#card-catalog');
const cardPreviewTemplate = ensureElement<HTMLTemplateElement>('#card-preview');
const cardBasketTemplate = ensureElement<HTMLTemplateElement>('#card-basket');
const orderTemplate = ensureElement<HTMLTemplateElement>('#order');
const contactsTemplate = ensureElement<HTMLTemplateElement>('#contacts');
const successTemplate = ensureElement<HTMLTemplateElement>('#success');

// константы объектов отображения
const page = new PageUI(document.body, events);
const popup = new PopupUI(ensureElement<HTMLElement>('#modal-container'), events);
const basketModal = new BasketUI(ensureElement<HTMLElement>('.basket'), events);
const orderModal = new OrderUI(cloneTemplate(orderTemplate), events);
const contactModal = new ContactsUI(cloneTemplate(contactsTemplate), events);
const successModal = new SuccessUI(cloneTemplate(successTemplate), events);

// модель состояния приложения
const appData = new AppState({}, events);

// заполнение стоковых карточек
events.on('stock:changed', () => {
    page.productList = appData.stock.map((element: IProduct) => {
        const card = new CardUI(cloneTemplate(cardCatalogTemplate), {
            onClick: () => events.emit('card:select', element)
        }, undefined);

        return card.render({
            title: element.title,
            category: element.category,
            image: element.image,
            price: element.price
        });
    })
})

// изменение счетчика корзины
events.on('basket:change', () => {
    page.basketCounter = appData.countBasket();
});

//открытие модального окна карточки
events.on('card:select', (element: IProduct) => {
    if(appData.checkBasket(element)){
        const card = new CardUI(cloneTemplate(cardPreviewTemplate), undefined, 
            {onClick: () => events.emit('card:remove', element)},'Удалить'
        );
        popup.render({
            content: card.render({
                title: element.title,
                image: element.image,
                description: element.description,
                price: element.price,
                category: element.category,
            })
        });
    } else {
        const card = new CardUI(cloneTemplate(cardPreviewTemplate), undefined, 
            {onClick: () => events.emit('card:add', element)}
        );
        popup.render({
            content: card.render({
                title: element.title,
                image: element.image,
                description: element.description,
                price: element.price,
                category: element.category,
            })
        });
    }
  });

// действие добавления карточки в корзину
events.on('card:add', (item: IProduct) => {
    appData.addBasket(item);
    popup.close();
    events.emit('basket:change');
});

// действие удаления карточки из корзины
events.on('card:remove', (item: IProduct) => {
    appData.removeBasket(item);
    popup.close();
    events.emit('basket:change');
});

//открытие модального окна корзины
events.on('basket:open', () => {
    basketModal.total = appData.sumBasket();
    basketModal.basketList = appData.basket.map((element: IProduct) => {
        const card = new CardUI(cloneTemplate(cardBasketTemplate), undefined, {
            onClick: () => {events.emit('card:remove', element);
                    events.emit('basket:open');}
        });
    
        return card.render({
            title: element.title,
            price: element.price
        })
    })
    if(appData.countBasket() === 0) { 
        basketModal.setButtonInactive();
    } else {
        basketModal.setButtonActive();
    }
    popup.render({
        content: basketModal.render(),
    })
});

// открытие модального окна заказа
events.on('order:open', () => {
    popup.render({
        content: orderModal.render({
            valid: false,
            errors: []
        })
    });
    orderModal.valid = orderModal.checkValid();
});

// действие при изменении значений в модальном окне заказа
events.on(/^order\..*:change/, () => {    
    orderModal.valid = orderModal.checkValid();

    appData.order.address = orderModal.getAddress();
    appData.order.payment = orderModal.getPayment();
});

// открытие модального окна контактов
events.on('order:submit', () => {
    popup.render({
        content: contactModal.render({
            email: '',
            phone: '',
            valid: false,
            errors: []
        })
    });
    contactModal.valid = contactModal.checkValid();
});

// действие при изменении значений в модальном окне контактов
events.on(/^contacts\..*:change/, (errors: Partial<ContactsUI>) => {
    contactModal.valid = contactModal.checkValid();

    appData.order.email = contactModal.getEmail();
    appData.order.phone = contactModal.getPhone();
});

// отправка заказа
events.on('contacts:submit', () => {
    appData.fillOrder();
    api.orderProducts(appData.order)
    .then(res => {
        events.emit('success', res)
    })
    .catch(err => {
        console.error(err);
    });
});

// открытие модального окна подтверждения заказа
events.on('success', (res: {
    id: string,
    total: number,
}) => {
    successModal.setTotal(res.total);
    popup.render({
        content: successModal.render(),
    });
});

// действие при открытии попапа (блокировка страницы)
events.on('popup:open', () => {
    page.locked = true;
});

// действие при закрытии попапа (разблокировка страницы)
events.on('popup:close', () => {
    page.locked = false;
});

// очистка данных
events.on('refresh:all', () => {
    appData.clean();
    events.emit('basket:change');
    popup.close();
    orderModal.clean();
    contactModal.clean();
});

//получение начальных данных
api.getProductList()
    .then(appData.setStock.bind(appData))
    .catch(err => {
        console.error(err);
    });