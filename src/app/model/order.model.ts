import { UserDTO } from './user.model';

export interface OrderDTO {
  id: number; // ID của đơn hàng
  user: UserDTO; // Thông tin người dùng liên quan đến đơn hàng
  name: string;
  phone: string; // Số điện thoại liên hệ
  address: string; // Địa chỉ giao hàng

  isEditing: boolean;
  isUpdating: boolean;
}
