import { Routes } from "@angular/router";
import { HomeComponent } from "./shared/features/home/home.component";
import { ContactFormComponent } from "./contact/features/contact-form/contact-form.component";
import { LoginComponent } from "./auth/features/login/login.component";

export const APP_ROUTES: Routes = [
  { path: 'login',
    component: LoginComponent },
  {
    path: "home",
    component: HomeComponent,
  },
  {
    path: "products",
    loadChildren: () =>
      import("./products/products.routes").then((m) => m.PRODUCTS_ROUTES)
  },
  {
    path: "contact",
    component: ContactFormComponent,
  },
  { path: "", redirectTo: "login", pathMatch: "full" },
];
