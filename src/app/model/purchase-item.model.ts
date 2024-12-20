import { ProductDTO } from './product.model';
import {ProductVariantDTO} from './product-variant.model';
import { PurchaseDTO } from './purchase.model';
import {VariantAttributeDTO} from './variant-attribute.model';

export interface PurchaseItemDTO {
  id: number; // ID của mục mua
  product: ProductDTO; // Thông tin sản phẩm
  quantity: number; // Số lượng sản phẩm
  attribute: VariantAttributeDTO;
  purchase: PurchaseDTO; // Thông tin đơn mua
  rated:boolean;
}
