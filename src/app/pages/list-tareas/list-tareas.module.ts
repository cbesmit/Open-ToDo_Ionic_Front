import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ListTareasPageRoutingModule } from './list-tareas-routing.module';

import { TaskComponentModule } from './components/task/task.module';

import { ListTareasPage } from './list-tareas.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ListTareasPageRoutingModule,
    TaskComponentModule,
    ReactiveFormsModule
  ],
  declarations: [ListTareasPage]
})
export class ListTareasPageModule {}
