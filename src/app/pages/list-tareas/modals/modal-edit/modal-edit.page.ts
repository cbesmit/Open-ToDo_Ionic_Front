import { Component, OnInit } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { ToastController, LoadingController } from '@ionic/angular';
import fetchServer from '../../../../services/fetchServer';

@Component({
  selector: 'app-modal-edit',
  templateUrl: './modal-edit.page.html',
  styleUrls: ['./modal-edit.page.scss'],
})
export class ModalEditPage implements OnInit {
  public frm: FormGroup;
  public taskID: any;

  constructor(private modalController: ModalController,
    private navParams: NavParams,
    private formBuilder: FormBuilder,
    public toastController: ToastController,
    public loadingController: LoadingController
  ) {
    this.frm = this.formBuilder.group({
      titulo: ['', Validators.required],
      detalle: [''],
      fechaVencimiento: [''],
      estatus: [false, Validators.required],
    });
  }

  ngOnInit() {
    this.taskID = this.navParams.data.itemID;
    if (!this.taskID) return;
    this.getData();
  }

  async getData() {
    if (!this.taskID) return;
    await fetchServer.call('tareas/detail/' + this.taskID, 'GET').then(response => {
      if (!response.ok) throw new Error(fetchServer.getTextError(response, 'Error al obtener la tarea'));
      this.frm.patchValue({
        titulo: response.data.data[0].titulo,
        detalle: response.data.data[0].detalle,
        fechaVencimiento: (response.data.data[0].fechaVencimiento) ? response.data.data[0].fechaVencimiento.split('T')[0] : '',
        estatus: (response.data.data[0].estatus === 'Pendiente') ? false : true,
      });
    }).catch(async error => {
      let msgError = (error.message && error.message != '') ? error.message : (error.constructor === Object && Object.keys(error).length !== 0) ? JSON.stringify(error) : error;
      const toast = await this.toastController.create({
        color: 'danger',
        duration: 2000,
        message: msgError,
      });
      toast.present();
    });
  }

  async closeModal(actualizar: boolean = false) {
    await this.modalController.dismiss(actualizar);
  }

  async onSave() {
    let dataSend = this.frm.value;
    dataSend.estatus = (dataSend.estatus) ? 'Completada' : 'Pendiente';
    const loading = await this.loadingController.create({ message: 'Creando...' });
    await loading.present();
    await fetchServer.call('tareas/update/' + this.taskID, 'PUT', dataSend).then(async response => {
      if (!response.ok) throw new Error(fetchServer.getTextError(response, 'Error al borrar las tareas'));
      const toast = await this.toastController.create({
        color: 'primary',
        duration: 2000,
        message: response.data.msg,
      });
      toast.present();
      this.closeModal(true);
    }).catch(async error => {
      let msgError = (error.message && error.message != '') ? error.message : (error.constructor === Object && Object.keys(error).length !== 0) ? JSON.stringify(error) : error;
      const toast = await this.toastController.create({
        color: 'danger',
        duration: 2000,
        message: msgError,
      });
      toast.present();
    });
    await loading.dismiss();
  }

  async onDelete() {
    let sendTasks = [this.taskID];
    const loading = await this.loadingController.create({ message: 'Borrando...' });
    await loading.present();
    await fetchServer.call('tareas/deleteList', 'POST', {'ids': sendTasks}).then(async response => {
      if (!response.ok) throw new Error(fetchServer.getTextError(response, 'Error al borrar las tareas'));
      const toast = await this.toastController.create({
        color: 'primary',
        duration: 2000,
        message: response.data.msg,
      });
      toast.present();
      this.closeModal(true);
    }).catch(async error => {
      let msgError = (error.message && error.message != '') ? error.message : (error.constructor === Object && Object.keys(error).length !== 0) ? JSON.stringify(error) : error;
      const toast = await this.toastController.create({
        color: 'danger',
        duration: 2000,
        message: msgError,
      });
      toast.present();
    });
    await loading.dismiss();
  }

}
