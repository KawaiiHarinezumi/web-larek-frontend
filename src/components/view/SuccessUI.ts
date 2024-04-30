import { ensureElement } from "../../utils/utils";
import { Component } from "../base/Component";
import { ISuccessUI } from "../../types";
import { IEvents } from "../base/events";


export class SuccessUI extends Component<ISuccessUI> {
    protected _button: HTMLButtonElement;

    constructor(container: HTMLElement, protected events: IEvents) {
        super(container);

        this._button = ensureElement<HTMLButtonElement>('.order-success__close', container);
        this._button.addEventListener('click', () => {
            events.emit('refresh:all');
          });
    }

    setTotal(total: number) {
        ensureElement<HTMLElement>('.order-success__description', this.container).textContent = ('Списано '+ String(total) + ' синапсов');
    }

}