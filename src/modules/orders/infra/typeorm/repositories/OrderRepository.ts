import { EntityRepository, Repository } from 'typeorm';
import Order from '../entities/Order';

@EntityRepository(Order)
export class OrdersRepository extends Repository<Order> {
  public async findById(id: string): Promise<Order | undefined> {
    const order = await this.findOne(id, {
      relations: ['order_products', 'customer'],
    });
    return order;
  }
}
