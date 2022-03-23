import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CreateTareaPageRoutingModule } from './create-tarea-routing.module';

import { CreateTareaPage } from './create-tarea.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CreateTareaPageRoutingModule
  ],
  declarations: [CreateTareaPage]
})
export class CreateTareaPageModule {}
