import { Component } from '@angular/core';
import Product from 'src/app/model/product';
import { AdminService } from 'src/app/services/admin.service';
import { UserService } from 'src/app/services/user.service';
import { LoginService } from 'src/app/services/login.service';
import { SearchService } from 'src/app/services/search.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-manage',
  templateUrl: './manage.component.html',
  styleUrls: ['./manage.component.css']
})
export class ManageComponent {
  constructor(private userHttp: UserService, private adminHttp: AdminService,
    private authService: LoginService, private search: SearchService,
    private router: Router) { }

  productList: Product[] = [];
  category: number = 1; //show which category
  editAddTgl = false; //add or edit mode
  productError: string = "";
  successMsg: String = "";
  editThisProduct: Product | undefined; //existing product
  //new product:
  addName: string = "";
  addCategory: number = 0;
  addPrice: number = 0;
  addImg: any;


  ngOnInit() {
    if (localStorage.getItem('loginData')) {
      if (JSON.parse(localStorage['loginData']).role != "admin") {
        localStorage.removeItem('loginData');
        if (localStorage.getItem('loginTime'))
          localStorage.removeItem('loginTime');
        console.log("Session time out");
        this.router.navigate(['home']); //no admin - GO HOME!
      }
    }
    else {
      if (localStorage.getItem('loginTime'))
        localStorage.removeItem('loginTime');
      //this.search.setShowSearch(false);
      console.log("Session time out");
      this.router.navigate(['home']);
    }
    this.authService.checkSessionTime(); //check if login time has over
    this.getProductsByCategory();
    let myTimeOut = setTimeout(() => {//hide search
      this.search.setShowSearch(false);
      clearTimeout(myTimeOut);
    }, 0);
  }

  getProductsByCategory() {
    this.userHttp.getProductsByCategory(this.category)
      .subscribe(
        val => {
          this.productList = val;
        },
        err => {
          if (err.status && err.status === 401) {
            if (localStorage.getItem('loginData'))
              localStorage.removeItem('loginData');
            this.ngOnInit();
          }
        });
  }

  categoryChange(categoryId: number) {
    this.category = categoryId;
    this.getProductsByCategory();
  }

  editProduct(product: Product) {
    this.editThisProduct = {
      id: product.id,
      name: product.name,
      price: product.price,
      category_id: product.category_id,
      image: product.image
    }
    //clear add-product history
    this.editAddTgl = false;
    this.addName = "";
    this.addCategory = 0;
    this.addPrice = 0;
    this.addImg = undefined;
    this.productError = "";
    this.successMsg = "";
  }

  saveEdited() {
    this.productError = "";
    this.successMsg = "";
    if (this.editThisProduct && (this.editThisProduct.price * 100) % 1 != 0)
      this.editThisProduct.price = Number((this.editThisProduct.price).toFixed(2));
    if (this.editThisProduct) {
      const error = this.productValid(this.editThisProduct);
      if (error) //stop
        this.productError = error;
      else { //make FormData with info (and image if changed)
        const editedProduct = new FormData();

        editedProduct.append("product", JSON.stringify(this.editThisProduct));
        if (this.addImg)
          editedProduct.append("image", this.addImg);

        this.adminHttp.editProduct(editedProduct)
          .then(val => {
            if (val?.message) {
              console.log(val.message);
              if (this.editThisProduct?.category_id == this.category)//if the product is in the current category - refresh products
                this.categoryChange(this.category);
              this.addImg = undefined;
              this.editThisProduct = undefined;
            }
          },
            err => {
              if (err.status && err.status === 401) {
                if (localStorage.getItem('loginData'))
                  localStorage.removeItem('loginData');
                this.ngOnInit();
              }
            });
      }
    }
  }

  cancelEdit() {
    this.editThisProduct = undefined;
    this.editAddTgl = false;
    this.addName = "";
    this.addCategory = this.addPrice = 0;
    this.productError = "";
    this.successMsg = "";
    this.addImg = undefined;
  }

  addProduct() {
    this.editThisProduct = undefined;
    this.editAddTgl = true;
    this.productError = "";
    this.successMsg = "";
    this.addImg = undefined;
  }

  saveAdded() {
    if ((this.addPrice * 100) % 1 != 0)
      this.addPrice = Number(this.addPrice.toFixed(2));
    console.log(this.addPrice);

    this.productError = "";
    this.successMsg = "";
    const newProduct: Product = {
      id: 0,
      name: this.addName,
      category_id: this.addCategory,
      price: this.addPrice,
      image: ""
    };
    const error = this.productValid(newProduct);
    if (error)
      this.productError = error;
    else if (!this.addImg)
      this.productError = "Image is missing";
    else { //make FormData with info and image
      const fullProduct = new FormData();
      fullProduct.append("product", JSON.stringify(newProduct));
      fullProduct.append("image", this.addImg);

      this.adminHttp.newProduct(fullProduct)
        .then(val => {
          //console.log(val);
          if (val?.message) {
            console.log(val.message);

            this.successMsg = val.message;
            this.addName = "";
            this.addCategory = 0;
            this.addPrice = 0;
            this.addImg = undefined;
            if (newProduct.category_id == this.category) //if the product is in the current category - refresh products
              this.categoryChange(this.category);
          }
        },
          err => {
            if (err.status && err.status === 401) {
              if (localStorage.getItem('loginData'))
                localStorage.removeItem('loginData');
              this.ngOnInit();
            }
          });
    }
  }

  productValid(product: Product) {
    if (!product.name)
      return "Product's name is missing";
    else if (product.name.length < 2)
      return "Product's name is too short";
    else if (product.name.length > 20)
      return "Product's name is too long";
    else if (!product.category_id)
      return "Product's category is missing";
    else if (!product.price)
      return "Product's price is missing";
    else if (product.price <= 0)
      return "Product's price is too low";
    else if (product.price > 99999)
      return "Product's price is too high";
    else if (this.addImg && !this.getExtension(this.addImg))
      return "Image file is invalid"
    else
      return "";
  }

  processFile(imageInput: any) { //after selecting an image - process into this.addImg
    if (imageInput.target.files && imageInput.target.files[0])
      this.addImg = imageInput.target.files[0];
  }

  getExtension(image: any) {//checks file type by it's ending
    if (image && image.name) {
      let extension = image.name.split(".");
      extension = extension[extension.length - 1];
      if (extension === "jpg" || extension === "jpeg" || extension === "png" || extension === "jfif" ||
        extension === "pjpeg" || extension === "pjp" || extension === "webp")
        return true;
      else
        return false;
    }
    else
      return false;
  }

}
