import {Component, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import { HeaderComponent } from "../../layout/header/header.component";
import { FooterComponent } from "../../layout/footer/footer.component";
import {ActivatedRoute, Route, Router, RouterLink, RouterOutlet} from '@angular/router';
import {ProductDetailService} from './product-detail.service';
import {ProductDTO} from '../../model/product.model';
import {CurrencyPipe, NgFor, NgIf, NgOptimizedImage} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {ProductVariantComponent} from './product-variant/product-variant.component';
import {VariantAttributeComponent} from './product-variant/variant-attribute/variant-attribute.component';
import {VariantAttributeDTO} from '../../model/variant-attribute.model';
import {AuthService} from '../../feature/auth/auth.service';
import {CartService} from '../../feature/cart/cart.service';
import {CartItemService} from '../../feature/cart/cart-item/cart-item.service';
import {UserDTO} from '../../model/user.model';
import {CartItemDTO} from '../../model/cart-item.model';
import {CartDTO} from '../../model/cart.model';
import {HttpErrorResponse} from '@angular/common/http';
import {ProductVariantDTO} from '../../model/product-variant.model';
import {ProductVariantService} from './product-variant/product-variant.service';
import {ProductService} from '../../admin/admin-sidebar/product/product.service';
import {CategoryService} from '../../admin/admin-sidebar/category/category.service';
import {CategoryDTO} from '../../model/category.model';
import {VariantAttributeService} from './product-variant/variant-attribute/variant-attribute.service';
import {ProductFeedbackService} from '../../admin/admin-sidebar/product-feedback/product-feedback.service';
import {ProductFeedbackDTO} from '../../model/product-feedback.model';
import {PurchaseItemService} from '../../feature/purchase/purchase-item/purchase-item.service';
import {PurchaseService} from '../../feature/purchase/purchase.service';
import {OrderService} from '../../feature/order/order.service';
import {PurchaseDTO} from '../../model/purchase.model';
import {PurchaseItemDTO} from '../../model/purchase-item.model';
import {OrderDTO} from '../../model/order.model';
import {PaymentDTO} from '../../model/payment.model';
import {PaymentService} from '../../admin/admin-sidebar/payment/payment.service';



@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [HeaderComponent, FooterComponent, CurrencyPipe, NgIf, NgFor, FormsModule, NgOptimizedImage, RouterOutlet, ProductVariantComponent, VariantAttributeComponent, RouterLink],
  templateUrl: './product-detail.component.html',
  styleUrl: './product-detail.component.scss'
})
export class ProductDetailComponent implements OnInit{

  constructor(private route: ActivatedRoute, private router: Router,
              private productDetailService: ProductDetailService,
              private cartService: CartService,
              private authService: AuthService,
              private cartItemService: CartItemService,
              private productVariantService: ProductVariantService,
              private productService: ProductService,
              private categoryService: CategoryService,
              private variantAttributeService: VariantAttributeService,
              private productFeedbackService: ProductFeedbackService,
              private purchaseItemService: PurchaseItemService,
              private purchaseService: PurchaseService,
              private orderService: OrderService,
              private paymentService: PaymentService,) {
  }
  product: ProductDTO | null = null; // Đối tượng chứa thông tin sản phẩm
  loading: boolean = true; // Biến để hiển thị trạng thái loading
  errorMessage: string = ''; // Biến để lưu lỗi nếu xảy ra
  seller: any;
  selectedAttribute: VariantAttributeDTO | null = null;
  currentUserId!: number ;
  cartId: number | null = null;
  cart: any;
  user: UserDTO| null = null;
  cartItem: CartItemDTO| null = null;
  productVariants: ProductVariantDTO[]=[];
  updatedProduct: ProductDTO | null = null;
  categories: CategoryDTO[]=[];
  attributeId!: number;
  feedbacks: ProductFeedbackDTO[]=[];
  purchase: PurchaseDTO | null = null;
  purchases: PurchaseDTO[]=[];
  purchaseItem: PurchaseItemDTO | null = null;
  orders: OrderDTO[]=[];
  payments:PaymentDTO[]=[];


  ngOnInit(): void {

    const productId = Number(this.route.snapshot.paramMap.get('id'));

    this.checkUserandGetCart();

    if (productId) {

      this.productDetailService.getProductById(productId).subscribe({
        next: (data: ProductDTO) => {
          this.product = data;
          this.seller=data.user;
          console.log(this.product);
          this.loading=false;
          this.getFeedbacks();
        },
        error: (err) => {
          console.error('Error fetching product details:', err);
          alert('Failed to load product'+err);
          this.loading= false;
        }
      });
    } else {
      this.errorMessage = 'ID sản phẩm không hợp lệ.';
      this.loading = false;
    }

    this.fetchProductVariants(productId);

    this.fetchCategories();




    this.paymentService.getPayments().subscribe({
      next: (data:PaymentDTO[]) => {
        console.log("payments ", data);
        this.payments = data;

      }, error: (err) => {
        console.error('Error fetching payments ', err);
      }
    })


  }


  onAttributeSelected(attribute: VariantAttributeDTO): void {
    this.selectedAttribute = attribute;
    this.attributeId=attribute.id;
    console.log('Selected Attribute in Product Detail:', this.selectedAttribute);
    console.log(this.attributeId);
    this.getAttribute(this.attributeId);

  }

  attribute=this.selectedAttribute;

  fetchCategories(): void {
    this.categoryService.getAllCategories().subscribe(
      (data) => {
        this.categories = data;
        console.log('Categories:', this.categories);
      },
      (error) => {
        console.error('Error fetching categories:', error);
      }
    );
  }

  getAttribute(attributeId:number){
    this.variantAttributeService.getAttribute(attributeId).subscribe({
      next:(attribute:VariantAttributeDTO) => {
        this.selectedAttribute= attribute;
        console.log('Fetched Attribute in pd:', this.selectedAttribute);
        return this.selectedAttribute;
      },
      error: (error:HttpErrorResponse) => {
        console.error('Error fetching attribute:', error);
        alert('Failed to fetch attribute');
      }
    })
  }

  fetchProductVariants(productId: number): void {
    this.productVariantService.getVariants(productId).subscribe({
      next: (variants: ProductVariantDTO[]) => {
        this.productVariants = variants;
      },
      error: (error: HttpErrorResponse) => {
        this.errorMessage = `Error fetching product variants: ${error.message}`;
        console.error(error);
      },
    });
  }

  checkUserandGetCart(){
    this.authService.isTokenValid().subscribe({
      next: (data) => {
        this.user=data.user;
        this.currentUserId=data.user.id;
        console.log(data);
        this.cartService.getCartById(data.user.id).subscribe({
          next: (data: CartDTO) => {
            this.cart = data;
            console.log(this.cart);
            return this.cart;

          },error: (error: HttpErrorResponse) => {
            console.error('Error fetching cart:', error);

          }
        })
        this.orderService.getOders(data.user.id).subscribe({
          next: (data:OrderDTO[]) => {
            console.log("orders ", data);
            this.orders = data;
          }, error: (error) => {
            console.error('Error fetching orders ', error);
          }
        })

      },
      error: (err) => {
        this.user=null;
        console.log(err);
      }
    })
  }
  toggleSale(): void {
    // Reset giá trị sale nếu tắt
    if (this.product&&!this.product.sale) {
      this.product.salePrice = 0;
      this.product.saleEndDate = '';
    }
  }
  newCartItem: any = {
    id: 0,
    cart: null,
    product: this.product,
    quantity: null,
    variantAttribute: this.selectedAttribute
  };

  addProductToCart(): void {
    if (this.user == null) {
      alert('You are not logged in');
      this.router.navigate(['/login']);
      return; // Dừng hàm nếu chưa đăng nhập
    }

    this.newCartItem.product=this.product;


    if (!this.product) {
      alert('Dữ liệu sản phẩm không hợp lệ. Vui lòng thử lại.');
      return;
    }

    if (!this.productVariants) {

      this.newCartItem.variantAttribute = null;
      console.log("Selected Variant Attribute: ", this.newCartItem.variantAttribute);

      this.newCartItem.cart=this.cart;
      if (this.newCartItem.cart == null) {
        alert("Giỏ hàng không hợp lệ.");
        console.log(this.newCartItem.cart);

        return;
      }
      this.newCartItem.cart=this.cart;

      // Cập nhật số lượng
      this.newCartItem.quantity = this.quantity;

      // Gọi API để tạo CartItem mới hoặc cập nhật nếu đã tồn tại
      this.cartItemService.createCartItem(this.newCartItem).subscribe({
        next: (response) => {
          console.log('Sản phẩm đã được thêm vào giỏ hàng:', response);
          alert('Sản phẩm đã được thêm vào giỏ hàng!');
        },
        error: (error) => {
          console.error('Lỗi khi thêm sản phẩm vào giỏ hàng:', error);
          alert('Không thể thêm sản phẩm vào giỏ hàng. Vui lòng thử lại.');
        }
      });
    }

    if (this.productVariants.length > 0) {
      if (this.selectedAttribute == null) {
        alert('Vui lòng chọn thuộc tính sản phẩm và thử lại.');
        console.log(this.attribute);
        return;
      }
      this.newCartItem.variantAttribute = this.selectedAttribute;
      console.log("Selected Variant Attribute: ", this.newCartItem.variantAttribute);

      this.newCartItem.cart=this.cart;
      if (this.newCartItem.cart == null) {
        alert("Giỏ hàng không hợp lệ.");
        console.log(this.newCartItem.cart);

        return;
      }
      this.newCartItem.cart=this.cart;

      // Cập nhật số lượng
      this.newCartItem.quantity = this.quantity;

      // Gọi API để tạo CartItem mới hoặc cập nhật nếu đã tồn tại
      this.cartItemService.createCartItem(this.newCartItem).subscribe({
        next: (response) => {
          console.log('Sản phẩm đã được thêm vào giỏ hàng:', response);
          alert('Sản phẩm đã được thêm vào giỏ hàng!');
        },
        error: (error) => {
          console.error('Lỗi khi thêm sản phẩm vào giỏ hàng:', error);
          alert('Không thể thêm sản phẩm vào giỏ hàng. Vui lòng thử lại.');
        }
      });

    }
    else {
      alert("illegal");
    }


  }

  showPurchaseForm: boolean = false;


  buynow(){
    if (this.user) {
      if (this.productVariants.length>0&&this.selectedAttribute == null) {
        alert('Vui lòng chọn thuộc tính sản phẩm và thử lại.');
        console.log(this.attribute)
        return;
      }

      this.showPurchaseForm = true;

    }
    else {
      alert("You are not logged in");
      this.router.navigate(['/login']);
    }
  }

  quantity: number = 1;



  newPurchase: any={
    id:0,
    order:null,
    user: this.user,
    payment:null,
    totalPrice:0,
  }

  createPurchase(){
    if (!this.newPurchase.user){
      this.newPurchase.user=this.user;
    }
    if (this.product)
    this.newPurchase.totalPrice=this.quantity*this.product.price;
    this.purchaseService.createPurchase(this.newPurchase).subscribe({
      next: (response) => {
        alert("create purchase successfully!");
        console.log(response);
        const newPurchaseItem: any={
          id:0,
          product:this.product,
          quantity: this.quantity,
          attribute:this.selectedAttribute,
          purchase: response,
          rated: false
        }

        this.purchaseItemService.createPurchaseItem(newPurchaseItem).subscribe({
          next: (response) => {
            alert("create purchase item successfully!");
            console.log(response);
          },
          error: (error) => {
            console.error('Error creating create purchase item', error);
          }
        })
      },error:err => {
        console.log(err);
      }
    })
  }




  cancelPurchase(): void {
    this.showPurchaseForm = false;
  }





  // Hàm giảm số lượng
  decreaseQuantity() {
    if (this.quantity > 1) {  // Đảm bảo không giảm dưới 1
      this.quantity--;
    }
  }

  // Hàm tăng số lượng
  increaseQuantity() {
    this.quantity++;
  }

  updateProduct(): void {
    if (!this.product) {
      alert('Dữ liệu sản phẩm không hợp lệ.');
      return;
    }

    this.productService.updateProduct(this.product.id, this.product).subscribe({

      next: (updatedProduct: ProductDTO) => {
        this.product = updatedProduct; // Cập nhật sản phẩm với dữ liệu mới
        alert('Sản phẩm đã được cập nhật thành công!');
        console.log('Updated product:', updatedProduct);
      },
      error: (err) => {
        console.error('Error updating product:', err);
        alert(err);
      }
    });
  }

  getFeedbacks(){
    if (this.product){
      this.productFeedbackService.getFeedbackByProductId(this.product.id).subscribe({
        next: (response) => {
          this.feedbacks=response;
          console.log(this.feedbacks);
        },
        error(err){
          console.log(err);
          alert(err);
        }
      })
    }

  }







}
