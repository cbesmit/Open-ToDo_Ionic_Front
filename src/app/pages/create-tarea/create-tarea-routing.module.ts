import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CreateTareaPage } from './create-tarea.page';

const routes: Routes = [
  {
    path: '',
    component: CreateTareaPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CreateTareaPageRoutingModule {}
