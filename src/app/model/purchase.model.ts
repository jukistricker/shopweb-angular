import { OrderDTO } from './order.model';
import { UserDTO } from './user.model';
import { PaymentDTO } from './payment.model';

export interface PurchaseDTO {
  id: number; // ID của đơn mua
  order: OrderDTO|null; // Thông tin đơn hàng
  user: UserDTO|null; // Thông tin người dùng
  payment: PaymentDTO|null; // Thông tin phương thức thanh toán
  totalPrice: number; // Tổng giá trị đơn hàng (BigDecimal được chuyển thành number)
}
