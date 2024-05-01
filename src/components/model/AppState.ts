import { IProduct, IOrder, IAppState } from "../../types";
import { Model } from "../base/Model";

export class AppState extends Model<IAppState> {
    stock: IProduct[] = []; 
    activeProduct: IProduct | null = null;
    basket: IProduct[] = [];
    address: string = '';
    payment: string = '';
    email: string = '';
    phone: string = '';

    setStock(list: IProduct[]) {
        this.stock = list;
        this.emitChanges('stock:changed', { stock: this.stock });
    }

    addBasket(item: IProduct) {
        this.basket.push(item);
    }

    removeBasket(item: IProduct) {
        const match = this.basket.findIndex(product => product.id === item.id);
        if (match >= 0) {
            this.basket.splice(match, 1);
        }
    }

    checkBasket(item:IProduct) {
        const match = this.basket.findIndex(product => product.id === item.id);
        return (match >= 0); //true - если эелемент в корзине, false - иначе
    }

    checkPriceless() {
        return this.basket.some( ({price}) => price == null);
    }

    sumBasket() {
        return this.basket.reduce((sum, current) => sum + current.price, 0);
    }

    countBasket() {
        return this.basket.length;
    }

    paymentSet(buttonContent: string) {
        if(buttonContent === 'Онлайн') {
            this.payment = 'online';
        }
        if(buttonContent === 'При получении') {
            this.payment = 'offline';
        }
    }

    checkValidOrder() { 
        if (this.payment.length > 0 && this.address.length > 0) { 
            return true; 
        } else { 
            return false; 
        } 
    }

    checkValidContacts() { 
        if (this.email.length > 0 && this.phone.length > 0) { 
            return true; 
        } else { 
            return false; 
        } 
    } 

    fillOrder() {
        let itemsBuffer: string[] = [];
        this.basket.forEach( (element) => {
            itemsBuffer.push(element.id); 
        });
        const order: IOrder = {
            total: this.sumBasket(),
            items: itemsBuffer,
            payment: this.payment,
            email: this.email,
            phone: this.phone,
            address: this.address,
        }
        return order;
    }

    clean() {
        this.payment = "";
        this.address = "";
        this.email = "";
        this.phone = "";
        this.basket.splice(0, this.basket.length);
        this.activeProduct = null;
    }
}