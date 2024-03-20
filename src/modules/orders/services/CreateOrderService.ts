/* eslint-disable no-unused-vars */
import Order from '../infra/typeorm/entities/Order';
import AppError from '@shared/errors/AppError';
import { inject, injectable } from 'tsyringe';
import { IOrdersRepository } from '../domain/repositories/IOrderRepository';
import { ICustomersRepository } from '@modules/customers/domain/repositories/ICustomersRepository';
import { IRequestCreateOrder } from '../domain/models/IRequestCreateOrder';
import { IProductsRepository } from '@modules/products/domain/repositories/IProductRepository';

@injectable()
class CreateOrderService {
  constructor(
    @inject('OrdersRepository')
    private ordersRepository: IOrdersRepository,

    @inject('CustomersRepository')
    private customersRepository: ICustomersRepository,

    @inject('ProductsRepository')
    private productsRepository: IProductsRepository,
  ) {}
  public async execute({
    products,
    customer_id,
  }: IRequestCreateOrder): Promise<Order> {
    const customerExists = await this.customersRepository.findById(customer_id);

    if (!customerExists) {
      throw new AppError('Could not find any customer with the given id');
    }

    const productsExists = await this.productsRepository.findAllByIds(products);

    if (!productsExists.length) {
      throw new AppError('Could not find any products with the given ids');
    }

    const existsProductsIds = productsExists.map(product => product.id);

    const checkInexistentProducts = products.filter(product => {
      !existsProductsIds.includes(product.id);
    });

    if (checkInexistentProducts.length) {
      throw new AppError(
        `Could not find product: ${checkInexistentProducts.map(product => {
          return `${product.id}\n`;
        })}`,
      );
    }
    const quantityAvailable = products.filter(
      product =>
        productsExists.filter(p => p.id === product.id)[0].quantity <
        product.quantity,
    );

    if (quantityAvailable.length) {
      throw new AppError(
        `The quantity ${quantityAvailable[0].quantity} is not available for ${quantityAvailable[0].id}`,
      );
    }

    const serializedProducts = products.map(product => ({
      product_id: product.id,
      quantity: product.quantity,
      price: productsExists.filter(p => p.id === product.id)[0].price,
    }));

    const order = await this.ordersRepository.create({
      customer: customerExists,
      products: serializedProducts,
    });

    const { order_products } = order;

    const updatedProductsQuantity = order_products.map(product => ({
      id: product.product_id,
      quantity:
        productsExists.filter(p => p.id === product.product_id)[0].quantity -
        product.quantity,
    }));

    await this.productsRepository.updateStock(updatedProductsQuantity);

    return order;
  }
}

export default CreateOrderService;
