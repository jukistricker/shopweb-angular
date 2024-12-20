import { PurchaseItemDTO } from './purchase-item.model';
import { UserDTO } from './user.model';

export interface ProductFeedbackDTO {
  id: number; // ID của phản hồi sản phẩm
  purchaseItem: PurchaseItemDTO; // Thông tin mục mua
  user: UserDTO; // Thông tin người dùng
  rate: number; // Đánh giá sản phẩm
  feedback: string; // Phản hồi về sản phẩm
}
