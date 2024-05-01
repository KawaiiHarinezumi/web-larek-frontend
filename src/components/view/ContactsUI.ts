import { IContactsForm } from "../../types";
import { IEvents } from "../base/Events";
import { Form } from "./FormUI";
import { ensureElement } from "../../utils/utils";


export class ContactsUI extends Form<IContactsForm> {
    protected _inputEmail: HTMLInputElement;
    protected _inputPhone: HTMLInputElement;
    phone: string;
    email: string;

    constructor(container: HTMLFormElement, events: IEvents) {
        super(container, events);
        this._inputEmail = ensureElement<HTMLInputElement>('[name="email"]', container);
        this._inputPhone = ensureElement<HTMLInputElement>('[name="phone"]', container);
    }
    set phoneSet(value: string) {
        this._inputPhone.value = value;
    }
    set emailSet(value: string) {
        this._inputEmail.value = value;
    }

    getPhone() {
        return this._inputPhone.value; 
    }

    getEmail() {
        return this._inputEmail.value; 
    }

    clean() {
        this._inputPhone.value = '';
        this._inputEmail.value = '';
    }
}