import { ProductDTO } from './product.model';

export interface ProductVariantDTO {
  id: number; // ID của biến thể sản phẩm
  product: ProductDTO; // Thông tin sản phẩm liên quan đến biến thể
}
