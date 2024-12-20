import {UserDTO} from './user.model';
import {CategoryDTO} from './category.model';

export interface ProductDTO {
  id: number;

  user: UserDTO;

  productName: string;

  category: CategoryDTO;

  description: string;

  featuredImageUrl: string;

  price: number;

  quantity: number;

  ProductState: string;

  purchaseCount: number;

  rating: number;

  sale: boolean;

  saleEndDate: string;

  salePrice: number;

  isEditing?: boolean;
  isUpdating?: boolean;
}
