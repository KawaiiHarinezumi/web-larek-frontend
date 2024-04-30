export interface IProduct {
    id: string;
    description: string;
    image: string;
    title: string;
    category: string;
    price: number | null;
}

export interface IOrder {
    payment: string;
    email: string;
    phone: string;
    address: string;
    total: number;
    items: string[];
}

export interface IResult {
    id: string;
    total: number;
}

export interface IAppState {
    activeProduct: IProduct | null;
    basket: IProduct[];
    stock: IProduct[];
    order: IOrder;
}

export interface IBasketUI {
    basketList: HTMLElement;
    total: number;
    button: HTMLButtonElement;
  }

export interface IOrderForm {
    buttonCard: HTMLButtonElement;
    buttonCash: HTMLButtonElement;
    inputAddress: HTMLInputElement;
    payment: string;
}

export interface IContactsForm {
  inputEmail: HTMLInputElement;
  inputPhone: HTMLInputElement;
  phone: string;
  email: string;
}

export interface ISuccessUI {
    button: HTMLButtonElement;
  }