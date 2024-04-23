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
- src/scss/styles.scss — корневой файл стилей
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

# Архитектура проекта
В данном проекте используется подход Model-View-Presenter, сокращённо MVP, позволяющий разделить отображение и данные. Архитектура данного приложения состоит из трех слоев:
1. Слой отображения (View) — интерфейс для взаимодействия с пользователем. Его задача — выводить что-то на экран и генерировать события с действиями пользователя. 
2. Слой представления (Presenter) — клиент API для взаимодействия с сервером. Его задача — получать данные извне и отправлять их за пределы браузера.
3. Слой данных (Model) — бизнес-логика проекта и хранение данных. Его задача — хранить данные и обрабатывать события на изменение этих данных.

Таким образом, мы используем событийно-ориентированный подход - взаимодействие между слоями приложения осуществляется через обмен данными, вызванными определенными событиями.

# Базовые типы данных
// Интерфейс для товара
interface IProduct {
    id: string;
    description: string;
    image: string;
    title: string;
    category: string;
    price: number | null;
    selected: boolean;
}

// Интерфейс для данных заказа
interface IOrder {
    payment: string;
    email: string;
    phone: string;
    address: string;
    total: number;
    items: string[];
}

// Интерфейс для событий
interface IEvents {
    on<T extends object>(event: EventName, callback: (data: T) => void): void;
    emit<T extends object>(event: string, data?: T): void;
    trigger<T extends object>(event: string, context?: Partial<T>): (data: T) => void;
}

## Базовые классы
```
class EventEmitter - базовый класс, брокер событий. Используется для реализации слушателей событий.
    _events: Map<EventName, Set<Subscriber>>;
    Основные методы:
        on(eventName: EventName, callback: (event: T)): void; - установить обработчик событий;
        off(eventName: EventName, callback: Subscriber): void; - снять обработчик событий;
        emit(eventName: string, data?: T): void; - инициировать событие;
        onAll(event: EmitterEvent): void; - слушать все события;
        offAll(): void; - сбросить все обработчики;
        trigger(eventName: string, context?: Partial<T>); - сделать коллбек триггер, генерирующий событие при вызове.
```

```
class Api - базовый класс для взаимодействия с API.
    baseURL: string;
    options: RequestInit;
    Основные методы:
        handleResponse(response: Response): Promise<object>; - внутренний метод, обработчик ответа на ошибки;
        get(uri: string):Promise<object>; - отправка get-запроса на сервер и получение ответа;
        post(uri: string, data: object, method: ApiPostMethods = 'POST'): Promise<object>; - отправка post-запроса с данными на сервер и получение ответа.
```

```
abstract class Model<T> - базовый абстрактный класс-дженерик, позволяет отличить простые объекты от моделей.
    Основные методы:
        emitChanges(event: string, payload?: object): void; - сообщает об изменении модели.
```

```
abstract class Component<T> - базовый абстрактный класс-дженерик, позволяет описать компоненты интерфейса.
    Основные методы:
        setVisible(element: HTMLElement): void; - показать элемент;
        setHidden(element: HTMLElement): void; - скрыть элемент;
        toggleClass(element: HTMLElement, className: string): void; - переключить класс;
        toggleDisabled(element: HTMLElement): void; - сменить статус блокировки;
        setText(element: HTMLElement, value: string): void; - установить текстовое содержимое;
        setImage(element: HTMLImageElement, src: string, alt: string): void; - установить изображение;
        render(data?: Partial<T>): HTMLElement; - вернуть корневой DOM-элемент.
```

## Классы модели данных
```
class ProductList extends Model<T> - класс, описывающий список товаров. На его основе будет создано два объекта - Basket (изначально пустой) и OfferList (изначально содержащий список товаров, полученных из API).
    list: IProduct[];
    Основные методы:
        fill(items: IProduct[]): void; - заполнение списка массивом товаров (например, полученными из API);
        add(item: IProduct): void; - добавить товар в список;
        remove(id: string): void; - удалить товар из списка;
        clean(): void; - удалить все товары из списка;
        count(): number; - возвращает количество элементов в списке;
        sum(): number; - возвращает общую стоимость товаров в списке.
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
        fillList(basket: ProductList): void; - заполняет ID товаров из корзины;
        sendOrder(): boolean; - отправить заказ через API;
```

```
class AppState extends Model<T> - класс описывающий текущее состояние сайта, а именно  кол-во товаров, их сумма и текущий активный товар.
    activeProduct: Product;
    Основные методы:
        clean(): void; - сбросить все состояния.
```

## Классы представления
```
class Popup extends Component<T> - класс, описывающий стандартное модальное окно.
    content: HTMLElement;
    button: HTMLButtonElement;
    closeButton: HTMLButtonElement;
    Основные методы:
        set content(value: HTMLElement): void; - сеттер для содержимого модального окна;
        set button(value: HTMLButtonElement): void; - сеттер для кнопки модального окна (продолжающей стандартный пользовательский путь: главная страница - карточка - корзина - оформление заказа - контактные данные - оплата);
        openPopup(): void; - открыть модальное окно;
        closePopup(): void; - закрыть модальное окно;
        toggleButton(): void; - сменить состояние кнопки (активная/не активная);
        render(successEvent: IEvent): HTMLElement; - отрендерить модальное окно и повесить слушатели.
```

```
class Form extends Component<T> - класс, описывающий формы ввода.
    form: HTMLFormElement;
    error: HTMLElement;
    Основные методы:
        set valid(value: boolean): void; - сеттер для валидации формы;
        set error(err: string): void - сеттер для ошибки;
        clean(): void; - очистить форму (будет использоваться, когда заказ успешен);
```       

```
class PageUI extends Component<T> - класс, описывающий главную страницу сайта.
    counter: HTMLElement;
    productList: HTMLElement;
    Основные методы:
        set basketCounter(value: number): void; - сеттер для счетчика товаров в корзине, отображающийся в шапке сайта;
        set productList(items: HTMLElement[]): void; - сеттер для вывода списка карточек товаров на странице.
```

```
class CardUI extends Component<T> - класс, описывающий содержимое окна карточки товара.
    title: HTMLElement;
    image: HTMLImageElement;
    category: HTMLElement;
    description: HTMLElement;
    price: HTMLElement;
    button: HTMLButtonElement;
    Основные методы:
        set ID(value: string): void; - сеттер для ID;
        get ID(): string; - геттер для ID;
        set title(value: string): void; - сеттер для заголовка карточки;
        get title(): string; - геттер для заголовка карточки;
        set description(value: string): void; - сеттер для описания;
        set image(url: string): void; - сеттер для изображения карточки;
        set price(value: number): void; - сеттер для цены;
        set category(value: string): void; - сеттер для категории.
```

```
class BasketUI extends Popup - класс, описывающий содержимое окна корзины с товарами.
    basketList: HTMLElement;
    totalPrice: HTMLElement;
    Основные методы:
        set basketList(items: HTMLElement[]): void; - сеттер для списка товаров в корзине;
        set totalPrice(value: number): void; - сеттер для суммарной цены товаров в корзине.
```

```
class OrderUI extends Popup - класс, описывающий содержимое, которое будет выводиться в окне заказа.
    paymentOnline: HTMLButtonElement;
    paymentCourier: HTMLButtonElement;
    addressForm: Form;
```

```
class ContactUI extends Popup - класс, описывающий содержимое, которое будет выводиться в окне контактов для оформления заказа.
    emailForm: Form;
    phoneForm: Form;
```        