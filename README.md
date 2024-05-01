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
В проекте использован событийно-ориентированный подход - взаимодействие между слоями приложения осуществляется через обмен данными, вызванными определенными событиями.

В данном проекте используется подход Model-View-Presenter, сокращённо MVP, позволяющий разделить отображение и данные. Архитектура данного приложения состоит из трех слоев:
1. Слой отображения (View) — интерфейс для взаимодействия с пользователем. Его задача — отображение данных на странице. 
2. Слой данных (Model) — бизнес-логика проекта. Его задача — хранить данные и обрабатывать события на изменение этих данных.
3. Презентер (Presenter) — отвечает за связь между данными и их представлением. В случае данного проекта представлен лишь слоем Connector (Api) и непосредственной событийной логикой взаимодействия между отображением и данными (корневой index.ts).

# Базовые типы данных
// Интерфейс для товара\
interface IProduct {\
    id: string;\
    description: string;\
    image: string;\
    title: string;\
    category: string;\
    price: number | null;\
}\
\
// Интерфейс для данных заказа\
interface IOrder {\
    payment: string;\
    email: string;\
    phone: string;\
    address: string;\
    total: number;\
    items: string[];\
}\
\
interface IResult {\
    id: string;\
    total: number;\
}\
\
interface IAppState {\
    activeProduct: IProduct | null;\
    basket: IProduct[];\
    stock: IProduct[];\
    order: IOrder;\
}\
\
interface IBasketUI {\
    basketList: HTMLElement;\
    total: number;\
    button: HTMLButtonElement;\
  }\
\
interface IOrderForm {\
    buttonCard: HTMLButtonElement;\
    buttonCash: HTMLButtonElement;\
    inputAddress: HTMLInputElement;\
    payment: string;\
}\
\
interface IContactsForm {\
  inputEmail: HTMLInputElement;\
  inputPhone: HTMLInputElement;\
  phone: string;\
  email: string;\
}\
\
interface ISuccessUI {\
    button: HTMLButtonElement;\
}\
\
// Интерфейсы базовых компонентов\
interface IEvents {\
    on<T extends object>(event: EventName, callback: (data: T) => void): void;\
    emit<T extends object>(event: string, data?: T): void;\
    trigger<T extends object>(event: string, context?: Partial<T>): (data: T) => void;\
}\
\
// Интерфейсы компонентов представления\
interface IPage {\
  counter: HTMLElement; \
  productList: HTMLElement[]; \
  basket: HTMLButtonElement;\
}\
\
interface IPopupData {\
    content: HTMLElement;\
}\
\
interface ICardActions {\
    onClick: (event: MouseEvent) => void;\
}\
\
interface IFormState {\
    valid: boolean;\
    errors: string[];\
}

## Базовые классы
```
class Api - базовый класс для взаимодействия с API.
    baseURL: string;
    _options: RequestInit;
    Основные методы:
        _handleResponse(response: Response): Promise<object>; - внутренний метод, обработчик ответа на ошибки;
        get(uri: string):Promise<object>; - отправка get-запроса на сервер и получение ответа;
        post(uri: string, data: object, method: ApiPostMethods = 'POST'): Promise<object>; - отправка post-запроса с данными на сервер и получение ответа.
```

```
abstract class Component<T> - базовый абстрактный класс-дженерик, позволяет описать компоненты интерфейса.
    Основные методы:
        _setVisible(element: HTMLElement): void; - показать элемент;
        _setHidden(element: HTMLElement): void; - скрыть элемент;
        _setText(element: HTMLElement, value: unknown): void; - установить текстовое содержимое;
        _setImage(element: HTMLImageElement, src: string, alt?: string): void; - установить изображение;
        render(data?: Partial<T>): HTMLElement; - вернуть корневой DOM-элемент.
```
```
class EventEmitter implements IEvents - базовый класс, брокер событий. Используется для реализации слушателей событий.
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
abstract class Model<T> - базовый абстрактный класс-дженерик, позволяет отличить простые объекты от моделей.
    Основные методы:
        emitChanges(event: string, payload?: object): void; - сообщает об изменении модели.
```

## Классы коммуникации
```
class WebLarekApi extends Api - класс взаимодействия с api сервера web larek.
    cdn: string;
    Основные методы:
        getProductList(): Promise<IProduct[]>; - получает промис, содержащий список товаров, которые можно приобрести;
        getProduct(id: string): Promise<IProduct>; - получает промис, содержащий определенный товар по id;
        orderProducts(order: IOrder): Promise<IResult>; - получает промис при отправлении заказа пользователя.
```

## Классы модели данных
```
class AppState extends Model<IAppState> - класс описывающий текущее состояние сайта, а именно список товаров, доступных для заказа; текущий активный товар; список товаров, добавленных в корзину; характеристика заказа.
    stock: IProduct[]; 
    activeProduct: IProduct | null;
    basket: IProduct[];
    address: string;
    payment: string;
    email: string;
    phone: string;
    Основные методы:
        setStock(list: IProduct[]): void; - принимает на вход список товаров (от сервера) и сохраняет их в stock;
        addBasket(item: IProduct): void; - принимает на вход продукт и добавляет его в корзину;
        removeBasket(item: IProduct): void; - принимает на вход продукт и удаляет его из корзины;
        checkBasket(item:IProduct): boolean; - принимает на вход продукт и проверяет есть ли он в корзине;
        checkPriceless(): boolean; - проверяет есть ли в корзине бесценные товары;
        sumBasket(): number; - считает сумму всех товаров в корзине;
        countBasket(): numder; - считает количество всех товаров в корзине;
        paymentSet(buttonContent: string): void; - делает маппинг названия кнопки на тип оплаты;
        checkValidOrder(): boolean; - валидация заполнения данных заказа (адрес и тип оплаты);
        checkValidContacts(): boolean; - валидация заполнения данных контактов (email и телефон);
        fillOrder(): IOrder; - формирует order;
        clean(): void; - сбрасывает заказ, корзину и активный товар.
```

## Классы представления
```
class PageUI extends Component<IPage> - класс, описывающий главную страницу сайта.
    _counter: HTMLElement;
    _productList: HTMLElement;
    _basket: HTMLButtonElement;
    _wrapper: HTMLElement;
    Основные методы:
        set basketCounter(value: number): void; - сеттер для счетчика товаров в корзине, отображающийся в шапке сайта;
        set productList(cards: HTMLElement[]): void; - сеттер для вывода списка карточек товаров на странице;
        set locked(value: boolean): void; - блокирует/разблокирует страницу;
```

```
class PopupUI extends Component<IPopupData> - класс, описывающий модальное окно.
    _content: HTMLElement;
    _closeButton: HTMLButtonElement;
    Основные методы:
        set content(value: HTMLElement): void; - сеттер для содержимого модального окна;
        open(): void; - открывает модальное окно;
        close(): void; - закрывает модальное окно;
        render(data: IPopupData): HTMLElement; - отображает модальное окно.
```

```
class CardUI<T> extends Component<IProduct> - класс создающий разметку карточки по переданному в конструктор макету.
    _title: HTMLElement;
    _image: HTMLImageElement;
    _description: HTMLElement;
    _category: HTMLElement;
    _price: HTMLElement;
    _button: HTMLButtonElement;
    _categoryColor = <Record<string, string>>;
    Основные методы:
        set title(value: string): void; - сеттер для заголовка карточки;
        set description(value: string): void; - сеттер для описания;
        set image(url: string): void; - сеттер для изображения карточки;
        set price(value: number): void; - сеттер для цены;
        set category(value: string): void; - сеттер для категории.
```

```
class BasketUI extends Component<IBasketUI> - класс, описывающий содержимое окна корзины с товарами.
    _basketList: HTMLElement;
    _total: HTMLElement;
    _button: HTMLButtonElement;
    Основные методы:
        set basketList(cards: HTMLElement[]): void; - сеттер для списка товаров в корзине;
        setTotal(priceless: boolean, total: number): void; - устанавливает суммарную цену товаров в корзине.
        setButtonInactive(): void; - отключает кнопку;
        setButtonActive(): void; - включает кнопку;
```

```
class Form<T> extends Component<IFormState> - класс, описывающий формы ввода.
    _submit: HTMLButtonElement;
    _errors: HTMLElement;
    Основные методы:
        _onInputChange(field: keyof T): void; - вызывает событие при изменении любого поля формы;
        set valid(value: boolean): void; - сеттер для валидации формы;
        render(state: Partial<T> & IFormState): HTMLElement; - отображает форму;
```

```
class class OrderUI extends Form<IOrderForm> - класс, описывающий содержимое, которое будет выводиться в окне заказа.
    _buttonCard: HTMLButtonElement;
    _buttonCash: HTMLButtonElement;
    _inputAddress: HTMLInputElement;
    payment: string = '';
    Основные методы:
        getAddress(): string; - возвращает значение, введенное в поле ввода адреса;
        clean(): void; - очищает форму;
```

```
class ContactsUI extends Form<IContactsForm> - класс, описывающий содержимое, которое будет выводиться в окне заказа.
    _inputEmail: HTMLInputElement;
    _inputPhone: HTMLInputElement;
    phone: string;
    email: string;
    Основные методы:
        getPhone(): string; - возвращает значение, введенное в поле ввода телефона;
        getEmail(): string; - возвращает значение, введенное в поле ввода e-mail;
        clean(): void; - очищает форму;
```

```
class SuccessUI extends Component<ISuccessUI> - класс, описывающий содержимое, которое будет выводиться в окне подтверждения заказа.
    _button: HTMLButtonElement;
    Основные методы:
        setTotal(total: number): void; - устанавливает сумму заказа для вывода.
```