import { CartDTO } from './cart.model';
import { ProductDTO } from './product.model';
import { ProductVariantDTO } from './product-variant.model';
import {VariantAttributeDTO} from './variant-attribute.model';

export interface CartItemDTO {
  id: number; // ID của mục giỏ hàng
  cart: CartDTO; // Thông tin giỏ hàng
  product: ProductDTO; // Thông tin sản phẩm
  quantity: number; // Số lượng sản phẩm
  variantAttribute: VariantAttributeDTO|null;
}
