import { Component } from "../base/Component";
import { IProduct } from "../../types/index";
import { ensureElement } from "../../utils/utils";

interface ICardActions {
    onClick: (event: MouseEvent) => void;
  }

export class CardUI<T> extends Component<IProduct> {
    protected _title: HTMLElement;
    protected _image: HTMLImageElement;
    protected _description: HTMLElement;
    protected _category: HTMLElement;
    protected _price: HTMLElement;
    protected _button: HTMLButtonElement;
    protected _categoryColor = <Record<string, string>> {
        "софт-скил": "soft",
        "другое": "other",
        "дополнительное": "additional",
        "кнопка": "button",
        "хард-скил": "hard"
      }

    constructor(container: HTMLElement, actions?: ICardActions, buttonActions?: ICardActions, buttonTextSwitched?: string) {
        super(container);
        this._title = ensureElement<HTMLElement>(`.card__title`, container);
        this._price = ensureElement<HTMLElement>(`.card__price`, container);

        if(container.querySelector(`.card__image`) != null) {
            this._image = ensureElement<HTMLImageElement>(`.card__image`, container);
        }

        if(container.querySelector(`.card__text`) != null) {
            this._description = ensureElement<HTMLElement>(`.card__text`, container);
        }

        if(container.querySelector(`.card__category`) != null) {
            this._category = ensureElement<HTMLElement>(`.card__category`, container);
        }      

        if(container.querySelector(`.card__button`) != null) {
            this._button = ensureElement<HTMLButtonElement>(`.card__button`, container);
        }
            
        if (actions?.onClick) {
            container.addEventListener('click', actions.onClick);
        }
        
        if (buttonActions?.onClick) {
            if (this._button) {
                if(buttonTextSwitched) {
                  this._button.textContent = buttonTextSwitched;
                }
                this._button.removeEventListener('click', buttonActions.onClick);
                this._button.addEventListener('click', buttonActions.onClick);
            } 
        }
      }
    
    set title(value: string) {
        this.setText(this._title, value);
    }

    set description(value: string) {
        if (Array.isArray(value)) {
            this._description.replaceWith(...value.map(str => {
                const descTemplate = this._description.cloneNode() as HTMLElement;
                this.setText(descTemplate, str);
                return descTemplate;
            }));
        } else {
            this.setText(this._description, value);
        }
    }

    set image(value: string) {
        this.setImage(this._image, value, this.title)
    }

    set price(value: number) {
        if (value === null) {
            this.setText(this._price, 'Бесценно');
        } else {
            this.setText(this._price, String(value) + ' синапсов');
        }
    }

    set category(value: string) {
        this.setText(this._category, value);
        this._category.className = `card__category card__category_${this._categoryColor[value]}`
    }
}