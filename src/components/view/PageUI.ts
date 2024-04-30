import { ensureElement } from "../../utils/utils";
import { Component } from "../base/Component";
import { IEvents } from "../base/events";

interface IPage {
    counter: HTMLElement; 
    productList: HTMLElement[]; 
    basket: HTMLButtonElement;
}

export class PageUI extends Component<IPage> {
    protected _counter: HTMLElement;
    protected _productList: HTMLElement;
    protected _basket: HTMLButtonElement;
    protected _wrapper: HTMLElement;

    constructor(container: HTMLElement, protected events: IEvents) {
        super(container);

        this._counter = ensureElement<HTMLElement>('.header__basket-counter');
        this._productList = ensureElement<HTMLElement>('.gallery');
        this._basket = ensureElement<HTMLButtonElement>('.header__basket');
        this._wrapper = ensureElement<HTMLElement>('.page__wrapper');

        this._basket.addEventListener('click', () => {
            this.events.emit('basket:open');
        });
    }

    set basketCounter(value: number) {
        this.setText(this._counter, String(value));
    }

    set productList(cards: HTMLElement[]) {
        this._productList.replaceChildren(...cards);
    }

    set locked(value: boolean) {
        if (value) {
            this._wrapper.classList.add('page__wrapper_locked');
        } else {
            this._wrapper.classList.remove('page__wrapper_locked');
        }
    }
}