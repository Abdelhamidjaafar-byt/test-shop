import { Component, OnInit, inject, signal } from "@angular/core";
import { Product } from "app/products/data-access/product.model";
import { ProductsService } from "app/products/data-access/products.service";
import { ProductFormComponent } from "app/products/ui/product-form/product-form.component";
import { ButtonModule } from "primeng/button";
import { TagModule } from 'primeng/tag';
import { CardModule } from "primeng/card";
import { DataViewModule } from 'primeng/dataview';
import { DialogModule } from 'primeng/dialog';
import { InputNumberModule } from "primeng/inputnumber";
import { InputTextModule } from "primeng/inputtext";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { CartService } from "app/shared/data-access/cart.service";
import { DropdownModule } from "primeng/dropdown";
import { SelectItem } from "primeng/api";
import { map } from "rxjs/operators";

const emptyProduct: Product = {
  id: 0,
  code: "",
  name: "",
  description: "",
  image: "",
  category: "",
  price: 0,
  quantity: 0,
  internalReference: "",
  shellId: 0,
  inventoryStatus: "INSTOCK",
  rating: 0,
  createdAt: 0,
  updatedAt: 0,
};

@Component({
  selector: "app-product-list",
  templateUrl: "./product-list.component.html",
  styleUrls: ["./product-list.component.scss"],
  standalone: true,
  imports: [
    DataViewModule,
    CardModule,
    ButtonModule,
    DropdownModule,
    DialogModule,
    InputNumberModule,
    TagModule,
    InputTextModule,
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    ProductFormComponent],
})
export class ProductListComponent implements OnInit {

  private readonly productsService = inject(ProductsService);
  private readonly cartService = inject(CartService);

  public products: Product[] = [];
  public cartItems = this.cartService.cartItems;

  public isDialogVisible = false;
  public isCreation = false;
  public readonly editedProduct = signal<Product>(emptyProduct);

  sortOptions!: SelectItem[];
  sortOrder!: number;
  sortField!: string;
  sortKey: string | undefined;

  ngOnInit() {
    this.loadProducts();

    this.sortOptions = [
      { label: 'Price High to Low', value: '!price' },
      { label: 'Price Low to High', value: 'price' }
    ];
  }

  private loadProducts() {
    this.productsService.get().pipe(
      map(products => products.sort((a, b) => b.createdAt - a.createdAt))
    ).subscribe({
      next: (data) => {
        this.products = data;
        console.log("Produits chargés :", this.products);
      },
      error: (err) => console.error("Erreur lors du chargement des produits :", err)
    });
  }

  /** 🆕 Création d'un produit **/
  public onCreate() {
    this.isCreation = true;
    this.isDialogVisible = true;
    this.editedProduct.set({ ...emptyProduct });
  }

  /** 📝 Modification d'un produit **/
  public onUpdate(product: Product) {
    this.isCreation = false;
    this.isDialogVisible = true;
    this.editedProduct.set({ ...product });
  }

  /** 🗑️ Suppression d'un produit **/
  public onDelete(product: Product) {
    this.productsService.delete(product.id).subscribe({
      next: () => {
        console.log(`Produit ${product.id} supprimé avec succès`);
        this.loadProducts();
      },
      error: (err) => console.error(`Erreur lors de la suppression du produit ${product.id} :`, err)
    });
  }


  /** 💾 Enregistrement (création ou modification) **/
  public onSave(product: Product) {
    if (this.isCreation) {
      // Handle product creation
      this.productsService.create(product).subscribe({
        next: (response) => {
          if (typeof response !== 'boolean') {
            this.products = [response, ...this.products]; // Add the newly created product
          } else {
            console.error("Erreur : la réponse n'est pas un produit valide");
          }
          this.closeDialog();
          this.loadProducts(); // Reload products after creation
        },
        error: (err) => console.error("Erreur lors de la création du produit :", err)
      });
    } else {     
      this.productsService.update(product).subscribe({
        next: (response) => {
          if (typeof response == 'boolean') {
            console.log("Produit modifié avec succès", response);
          } else {
            console.error("Erreur : la réponse n'est pas un produit valide");
          }
          this.closeDialog();
          this.loadProducts(); // Reload products after update
        },
        error: (err) => console.error("Erreur lors de la mise à jour du produit :", err)
      });
    }
  }
  public onCancel() {
    this.closeDialog();
  }

  private closeDialog() {
    this.isDialogVisible = false;
  }

  /** 🔄 Définit la couleur selon le stock **/
  getSeverity(product: Product) {
    switch (product.inventoryStatus) {
      case 'INSTOCK':
        return 'success';
      case 'LOWSTOCK':
        return 'warning';
      case 'OUTOFSTOCK':
        return 'danger';
      default:
        return undefined;
    }
  }

  /** 🔽 Gestion du tri **/
  onSortChange(event: any) {
    const value = event.value;

    if (value.indexOf('!') === 0) {
      this.sortOrder = -1;
      this.sortField = value.substring(1, value.length);
    } else {
      this.sortOrder = 1;
      this.sortField = value;
    }
  }

  /** 🛒 Ajouter au panier **/
  addToCart(product: Product) {
    if (!product.quantity) {
      product.quantity = 1;
    }

    this.cartService.addToCart(product).subscribe({
      next: () => console.log(`Produit ${product.id} ajouté au panier`),
      error: (err) => console.error(`Erreur lors de l'ajout du produit ${product.id} au panier :`, err)
    });
  }
}
