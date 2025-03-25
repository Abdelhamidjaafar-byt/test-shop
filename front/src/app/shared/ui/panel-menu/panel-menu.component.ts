import {
    Component,
  } from "@angular/core";
import { AuthService } from "app/auth/data-access/auth.service";
import { MenuItem } from "primeng/api";
  import { PanelMenuModule } from 'primeng/panelmenu';
  
  @Component({
    selector: "app-panel-menu",
    standalone: true,
    imports: [PanelMenuModule],
    template: `
        <p-panelMenu [model]="items" styleClass="w-full"/>
    `
  })
  export class PanelMenuComponent {

    constructor(public authService: AuthService) {}

    public readonly items: MenuItem[] = [
        {
            label: 'Accueil',
            icon: 'pi pi-home',
            routerLink: ['/home']
        },
        {
            label: 'Produits',
            icon: 'pi pi-barcode',
            routerLink: ['/products/list']
        },
        {
            label: 'Contact',
            icon: 'pi pi-address-book',
            routerLink: ['/contact']
        }
    ]
  }
  