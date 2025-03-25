import {
  Component,
  inject,
  ViewChild,
} from "@angular/core";
import { RouterModule } from "@angular/router";
import { SplitterModule } from 'primeng/splitter';
import { ToolbarModule } from 'primeng/toolbar';
import { BadgeModule } from 'primeng/badge';
import { PanelMenuComponent } from "./shared/ui/panel-menu/panel-menu.component";
import { ButtonModule } from "primeng/button";
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { CartService } from "./shared/data-access/cart.service";
import { CommonModule } from "@angular/common";
import { CardModule } from "primeng/card";
import { DataViewModule } from "primeng/dataview";
import { DividerModule } from 'primeng/divider';
import { InputNumberInputEvent, InputNumberModule } from "primeng/inputnumber";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { Product } from "./products/data-access/product.model";
import { AuthService } from "./auth/data-access/auth.service";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"],
  standalone: true,
  imports: [
    RouterModule, 
    DataViewModule,
    DividerModule,
    InputNumberModule,
    FormsModule,
    CardModule, 
    SplitterModule, 
    ToolbarModule, 
    BadgeModule, 
    ButtonModule, 
    OverlayPanelModule, 
    CommonModule, 
    PanelMenuComponent,
    ReactiveFormsModule,
    FormsModule,
  ],
})
export class AppComponent {
  title = "ALTEN SHOP";
  private readonly cartService = inject(CartService);
  public readonly cartItems = this.cartService.cartItems;
  public readonly totalItemsInCart = this.cartService.totalItemsInCart;

  token : string = '';

  constructor(public authService: AuthService) {}

  removeFromCart(product: Product) {
    this.cartService.removeFromCart(product).subscribe();
  }

  onQuantityChange($event: InputNumberInputEvent) {
    console.log("quantity change: " + $event.value);
    console.log(" change: " + $event.formattedValue);
    if($event.value){
      var quantityChange: number = +$event.value - +$event.formattedValue;
      console.log(" param: " + quantityChange);
      this.cartService.updateCart(quantityChange);
    }
  }

  ngOnInit() {
    this.token = 'Bearer ' + localStorage.getItem('token');
  }
}
