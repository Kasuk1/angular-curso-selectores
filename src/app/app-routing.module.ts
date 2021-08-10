import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: "paises",
    loadChildren: () => import("../app/paises/paises.module").then(m => m.PaisesModule)
  },
  {
    path: "**",
    redirectTo: "paises"
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
