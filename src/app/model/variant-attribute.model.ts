import {ProductVariantDTO} from './product-variant.model';

export interface VariantAttributeDTO {
  id: number;
  productVariant: ProductVariantDTO;
  attName: string;
}
