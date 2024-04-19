# Проектная работа "Веб-ларек"

Стек: HTML, SCSS, TS, Webpack

Структура проекта:
- src/ — исходные файлы проекта
- src/components/ — папка с JS компонентами
- src/components/base/ — папка с базовым кодом

Важные файлы:
- src/pages/index.html — HTML-файл главной страницы
- src/types/index.ts — файл с типами
- src/index.ts — точка входа приложения
- src/styles/styles.scss — корневой файл стилей
- src/utils/constants.ts — файл с константами
- src/utils/utils.ts — файл с утилитами

## Установка и запуск
Для установки и запуска проекта необходимо выполнить команды

```
npm install
npm run start
```

или

```
yarn
yarn start
```
## Сборка

```
npm run build
```

или

```
yarn build
```

## Базовые классы
```
class EventEmitter - базовый класс, брокер событий. Используется для реализации слушателей событий.
    _events: Map<EventName, Set<Subscriber>>;
    Основные методы:
        on - установить обработчик событий;
        off - снять обработчик событий;
        emit - инициировать событие;
        onAll - слушать все события;
        offAll - сбросить все обработчики;
        trigger - сделать коллбек триггер, генерирующий событие при вызове.
```

```
class Api - базовый класс для взаимодействия с API.
    baseURL: string;
    options: RequestInit;
    Основные методы:
        handleResponse - внутренний метод, обработчик ответа на ошибки;
        get - отправка get-запроса на сервер и получение ответа;
        post - отправка post-запроса с данными на сервер и получение ответа.
```

```
abstract class Model<T> - базовый абстрактный класс-дженерик, позволяет отличить простые объекты от моделей.
    Основные методы:
        emitChanges - сообщает об изменении модели.
```

```
abstract class Component<T> - базовый абстрактный класс-дженерик, позволяет описать компоненты интерфейса.
    Основные методы:
        setVisible - показать элемент;
        setHidden - скрыть элемент;
        toggleClass - переключить класс;
        toggleDisabled - сменить статус блокировки;
        setText - установить текстовое содержимое;
        setImage - установить изображение;
        render - вернуть корневой DOM-элемент.
```

## Классы модели данных
```
class Product extends Model<T> - класс товара, содержит информацию о товаре.
    id: string;
    title: string;
    category: string;
    description: string;
    image: string;
    price: number | null;
    selected: boolean;
    Основные методы:
        getID - возвращает ID для формирования заказа;
        getPrice - возвращает цену товара для формирования общей цены корзины.
```

```
class ProductList extends Model<T> - класс, описывающий список товаров. На его основе будет создано два объекта - Basket (изначально пустой) и OfferList (изначально содержащий список товаров, полученных из API).
    list: Product[];
    Основные методы:
        fill - заполнение списка товарами, полученными из API;
        add - добавить товар в список;
        remove - удалить товар из списка;
        clean - удалить все товары из списка;
        count - возвращает количество элементов в списке;
        sum - возвращает общую стоимость товаров в списке.
```

```
class Order extends Model<T> - класс, описывающий данные о заказе.
    items: string[];
    payment: number | null;
    total: number;
    address: string;
    email: string;
    phone: string;
    Основные методы:
        fillList - заполняет ID товаров из корзины;
        sendOrder - отправить заказ через API;
```

```
class AppState extends Model<T> - класс описывающий текущее состояние сайта, а именно  кол-во товаров, их сумма и текущий активный товар.
    count: number;
    sum: number;
    activeProduct: Product;
    Основные методы:
        clean - сбросить все состояния.
```

## Классы представления
```
class Popup extends Component<T> - класс, описывающий стандартное модальное окно.
    content: HTMLElement;
    button: HTMLButtonElement;
    closeButton: HTMLButtonElement;
    Основные методы:
        set content - сеттер для содержимого модального окна;
        set button - сеттер для кнопки модального окна (продолжающей стандартный пользовательский путь: главная страница - карточка - корзина - оформление заказа - контактные данные - оплата);
        openPopup - открыть модальное окно;
        closePopup - закрыть модальное окно;
        toggleButton - сменить состояние кнопки (активная/не активная);
        render - отрендерить модальное окно и повесить слушатели.
```

```
class Form extends Component<T> - класс, описывающий формы ввода.
    input: HTMLFormElement;
    error: HTMLElement;
    Основные методы:
        set valid - сеттер для валидации формы;
        set error - сеттер для ошибки;
        clean - очистить форму (будет использоваться, когда заказ успешен);
```       

```
class PageUI extends Component<T> - класс, описывающий главную страницу сайта.
    basketCounter: HTMLElement;
    productList: HTMLElement;
    Основные методы:
        set basketCounter - сеттер для счетчика товаров в корзине, отображающийся в шапке сайта;
        set productList - сеттер для вывода списка карточек товаров на странице.
```

```
class CardUI extends Component<T> - класс, описывающий карточку товара.
    title: HTMLElement;
    image: HTMLImageElement;
    category: HTMLElement;
    description: HTMLElement;
    price: HTMLElement;
    button: HTMLButtonElement;
    Основные методы:
        set ID, get ID - сеттер и геттер для ID;
        set title, get title - сеттер и геттер для заголовка карточки;
        set description - сеттер для описания;
        set image - сеттер для изображения карточки;
        set price - сеттер для цены;
        set category - сеттер для категории.
```

```
class BasketUI extends Popup - класс, описывающий корзину с товарами.
    basketList: HTMLElement;
    totalPrice: HTMLElement;
    Основные методы:
        set basketList - сеттер для списка товаров в корзине;
        set totalPrice - сеттер для суммарной цены товаров в корзине.
```

```
class OrderUI extends Popup - класс, описывающий окно заказа.
    paymentOnline: HTMLButtonElement;
    paymentCourier: HTMLButtonElement;
    addressForm: Form;
```

```
class ContactUI extends Popup - класс, описывающий окно контактов для оформления заказа.
    emailForm: Form;
    phoneForm: Form;
```        