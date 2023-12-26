import { getCustomRepository } from 'typeorm';
import { OrdersRepository } from '../typeorm/repositories/OrderRepository';
import Order from '../typeorm/entities/Order';
import { CustomersRepository } from '@modules/customers/typeorm/repositories/CustomersRepository';
import { ProductRepository } from '@modules/products/typeorm/repositories/ProductsRepository';
import AppError from '@shared/errors/AppError';

interface IProduct {
  id: string;
  product_id: string;
  price: number;
  quantity: number;
}

interface IRequest {
  customer: string;
  products: IProduct[];
}

class CreateOrderService {
  public async execute({ products, customer }: IRequest): Promise<Order> {
    const ordersRepository = getCustomRepository(OrdersRepository);
    const customersRepository = getCustomRepository(CustomersRepository);
    const productsRepository = getCustomRepository(ProductRepository);

    const customerExists = await customersRepository.findById(customer);

    if (!customerExists) {
      throw new AppError('Could not find any customer with the given id');
    }
    const productsExists = await productsRepository.findAllByIds(products);
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

    const order = ordersRepository.create({
      customer: customerExists,
      order_products: serializedProducts,
    });

    const { order_products } = order;
    const updatedQuantity = order_products.map(product => ({
      id: product.product_id,
      quantity:
        productsExists.filter(p => p.id === product.product_id)[0].quantity -
        product.quantity,
    }));

    await productsRepository.save(updatedQuantity);
    await ordersRepository.save(order);

    return order;
  }
}

export default CreateOrderService;
