import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ListTareasPage } from './list-tareas.page';

const routes: Routes = [
  {
    path: '',
    component: ListTareasPage
  },
  {
    path: 'modal-create',
    loadChildren: () => import('./modals/modal-create/modal-create.module').then( m => m.ModalCreatePageModule)
  },
  {
    path: 'modal-edit',
    loadChildren: () => import('./modals/modal-edit/modal-edit.module').then( m => m.ModalEditPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ListTareasPageRoutingModule {}
