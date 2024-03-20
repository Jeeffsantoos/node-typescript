import { ICustomer } from '@modules/customers/domain/models/ICustomer';
import { ICreateOrderProducts } from './ICreateOrderProduct';

export interface ICreateOrder {
  customer: ICustomer;
  products: ICreateOrderProducts[];
}
