import { ensureElement, ensureAllElements } from "../../utils/utils";
import { Component } from "../base/Component";
import { IEvents } from "../base/events";

interface IPopupData {
    content: HTMLElement;
}

export class PopupUI extends Component<IPopupData> {
    protected _content: HTMLElement;
    protected _closeButton: HTMLButtonElement;
  
    constructor(container: HTMLElement, protected events: IEvents) {
        super(container);
  
        this._content = ensureElement<HTMLElement>('.modal__content', container);
        this._closeButton = ensureElement<HTMLButtonElement>('.modal__close', container);
      
        this.container.addEventListener('click', this.close.bind(this));
        this._content.addEventListener('click', (event) => event.stopPropagation());
        this._closeButton.addEventListener('click', this.close.bind(this));
    }
  
    set content(value: HTMLElement) {
        this._content.replaceChildren(value);
    }
  
    open() {
        this.container.classList.add('modal_active');
        this.events.emit('popup:open');
    }
  
    close() {
        this.container.classList.remove('modal_active');
        this.content = null;
        this.events.emit('popup:close');
    }
  
    render(data: IPopupData): HTMLElement {
        super.render(data);
        this.open();
        return this.container;
    }
  }