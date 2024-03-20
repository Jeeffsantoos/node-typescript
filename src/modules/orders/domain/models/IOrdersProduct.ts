import { IProduct } from '@modules/products/domain/models/IProduct';
import { IOrder } from './IOrder';

export interface IOrdersProduct {
  id: string;
  order: IOrder;
  product: IProduct;
  product_id: string;
  order_id: string;
  price: number;
  quantity: number;
  created_at: Date;
  updated_at: Date;
}
