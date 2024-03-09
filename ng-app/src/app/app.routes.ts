import {Routes} from "@angular/router"
import {ActivateComponent} from "./features/auth/activate/activate.component"
import {AuthComponent} from "./features/auth/auth.component"
import {authRoutes} from "./features/auth/auth.constants"
import {HomeComponent} from "./features/home/home.component"

export const routes: Routes = [
  ...authRoutes.map(route => ({
    component: AuthComponent,
    path: route + (route === "update-password" ? "/:token" : ""),
  })),
  {component: ActivateComponent, path: "activate/:token"},
  {component: HomeComponent, path: "", pathMatch: "full"},
  {path: "**", redirectTo: ""},
]
