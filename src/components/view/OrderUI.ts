import { IOrderForm } from "../../types";
import { ensureElement } from "../../utils/utils";
import { IEvents } from "../base/Events";
import { Form } from "./FormUI";


export class OrderUI extends Form<IOrderForm> {
    protected _buttonCard: HTMLButtonElement;
    protected _buttonCash: HTMLButtonElement;
    protected _inputAddress: HTMLInputElement;
    payment: string = '';

    constructor(container: HTMLFormElement, events: IEvents) {
        super(container, events);

        this._buttonCard = ensureElement<HTMLButtonElement>('[name="card"]', container);
        this._buttonCash = ensureElement<HTMLButtonElement>('[name="cash"]', container);
        this._inputAddress = ensureElement<HTMLInputElement>('[name="address"]', container);

        this._buttonCard.addEventListener('click', () => {
            this.payment = 'online';
            this._buttonCard.classList.add('button_alt-active');
            this._buttonCash.classList.remove('button_alt-active');

            const field = this._buttonCard.name as keyof IOrderForm;
            this.onInputChange(field)
        
        });
      
        this._buttonCash.addEventListener('click', () => {
            this.payment = 'offline';
            this._buttonCash.classList.add('button_alt-active');
            this._buttonCard.classList.remove('button_alt-active');

            const field = this._buttonCard.name as keyof IOrderForm;
            this.onInputChange( field)
      });
  }

  getAddress() {
      return this._inputAddress.value; 
  }

  getPayment() {
      return this.payment;
  }

  checkValid() {
      if (this._inputAddress.value.length > 0 && (this.payment === 'online' || this.payment === 'offline')) {
        return true;
      } else {
        return false;
      }
  }

  clean() {
      this._inputAddress.value = '';
      this._buttonCash.classList.remove('button_alt-active');
      this._buttonCard.classList.remove('button_alt-active');
  }
}