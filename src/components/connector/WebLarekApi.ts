import { IOrder, IProduct, IResult } from "../../types";
import { Api, ApiListResponse} from "../base/api";

export class WebLarekApi extends Api {
    cdn: string;

    constructor(cdn: string, baseUrl: string, options?: RequestInit) {
        super(baseUrl, options)
        this.cdn = cdn;
    }
  
    getProductList(): Promise<IProduct[]> {
        return this.get('/product').then((data: ApiListResponse<IProduct>) =>
            data.items.map((item) => ({
                ...item,
                image: this.cdn + item.image
            }))
        );
    }

    getProduct(id: string): Promise<IProduct> {
        return this.get(`/product/${id}`).then(
            (item: IProduct) => ({
                ...item
            })
        );
    }

    orderProducts(order: IOrder): Promise<IResult> {
        return this.post('/order', order).then(
            (data: IResult) => data
        );
    }
}