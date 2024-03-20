import { ICustomer } from '@modules/customers/domain/models/ICustomer';
import { IOrdersProduct } from './IOrdersProduct';

export interface IOrder {
  id: string;
  customer: ICustomer;
  order_products: IOrdersProduct[];
  created_at: Date;
  updated_at: Date;
}
