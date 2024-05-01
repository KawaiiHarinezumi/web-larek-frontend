import { ensureAllElements, ensureElement } from "../../utils/utils";
import { Component } from "../base/Component";
import { IEvents } from "../base/Events";
import { IBasketUI } from "../../types";

  
  export class BasketUI extends Component<IBasketUI> {
    protected _basketList: HTMLElement;
    protected _total: HTMLElement;
    protected _button: HTMLButtonElement;
  
    constructor(container: HTMLElement, protected events: IEvents) {
        super(container);
  
        this._basketList = ensureElement<HTMLElement>('.basket__list', this.container);
        this._total = ensureElement<HTMLElement>('.basket__price', this.container);
  
        this._button = ensureElement<HTMLButtonElement>('.basket__button', this.container);
        this._button.addEventListener('click', () => {
            events.emit('order:open');
        });
      
        this.basketList = [];
    }
  
    set basketList(cards: HTMLElement[]) {
        this._basketList.innerHTML = '';
        this._basketList.replaceChildren(...cards);
      
        const liList: HTMLElement[] = ensureAllElements<HTMLElement>('.basket__item-index', this._basketList);
        let i: number = 1;
        liList.forEach((element) => {
            element.textContent = String(i);
            i++;
        });
    }
  
    set total(total: number) {
        this.setText(this._total, `${total} синапсов`);
    }
    
    setButtonInactive() {
        if (this._button) {
            this._button.setAttribute('disabled', 'disabled');
        }
    }

    setButtonActive() {
        if (this._button) {
            this._button.removeAttribute('disabled');
        }
    }
  }