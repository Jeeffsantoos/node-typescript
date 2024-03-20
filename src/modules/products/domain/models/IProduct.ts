import { IOrdersProduct } from '@modules/orders/domain/models/IOrdersProduct';

export interface IProduct {
  id: string;
  order_products: IOrdersProduct[];
  name: string;
  price: number;
  quantity: number;
  created_at: Date;
  updated_at: Date;
}
