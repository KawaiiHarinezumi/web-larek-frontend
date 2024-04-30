import { IProduct, IOrder, IAppState } from "../../types";
import { Model } from "../base/Model";

export class AppState extends Model<IAppState> {
    stock: IProduct[] = []; 
    activeProduct: IProduct | null = null;
    basket: IProduct[] = [];
    order: IOrder = {
        address: '',
        payment: 'card',
        email: '',
        total: 0,
        phone: '',
        items: []
      };

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

    sumBasket() {
        return this.basket.reduce((sum, current) => sum + current.price, 0);
    }

    countBasket() {
        return this.basket.length;
    }

    paymentSet(buttonContent: string) {
        if(buttonContent === 'Онлайн') {
            this.order.payment = 'online';
        }
        if(buttonContent === 'При получении') {
            this.order.payment = 'offline';
        }
    }

    fillOrder() {
        this.order.total = this.sumBasket();
        this.order.items = []; 
        this.basket.forEach( (element) => {
            this.order.items.push(element.id); 
        });
    }

    clean() {
        this.order.items.splice(0, this.order.items.length);
        this.order.payment = "";
        this.order.total = 0;
        this.order.address = "";
        this.order.email = "";
        this.order.phone = "";
        this.basket.splice(0, this.basket.length);
        this.activeProduct = null;
    }
}