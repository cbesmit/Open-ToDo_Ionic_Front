import { Component, OnInit } from '@angular/core';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastController, LoadingController, ModalController } from '@ionic/angular';
import fetchServer from '../../services/fetchServer';

import { ModalCreatePage } from './modals/modal-create/modal-create.page';
import { ModalEditPage } from './modals/modal-edit/modal-edit.page';

@Component({
  selector: 'app-list-tareas',
  templateUrl: './list-tareas.page.html',
  styleUrls: ['./list-tareas.page.scss'],
})
export class ListTareasPage implements OnInit {

  public tasks: { estatus: string, _id: string, titulo: string, fechaVencimiento: string, fechaCreacion: string, checked: boolean }[] = [];
  public checkAll: boolean = false;
  public searchTask: string = '';
  public seeAll: boolean = false;

  constructor(private formBuilder: FormBuilder,
    private router: Router,
    public toastController: ToastController,
    public loadingController: LoadingController,
    public modalController: ModalController
  ) {
  }

  ngOnInit() {
    this.getData();
  }

  async reload(ev) {
    await this.getData();
    ev.detail.complete();
  }

  async getData() {
    await fetchServer.call('tareas/list', 'GET').then(response => {
      if(response.status === 401 || response.data === "Unauthorized"){
        this.router.navigate(['/']);
        return;
      }
      if (!response.ok) throw new Error(fetchServer.getTextError(response, 'Error al obtener las tareas'));
      response.data.data.map(task => {
        task.fechaVencimiento = (task.fechaVencimiento) ? task.fechaVencimiento.split('T')[0] : '';
      });
      this.tasks = response.data.data;
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

  getTasks(){
    let tasks = [... this.tasks];
    if (this.seeAll) { tasks = tasks.filter(task => task.estatus === 'Pendiente'); }
    if(this.searchTask !== '') return tasks.filter(task => task.titulo.toLowerCase().includes(this.searchTask.toLowerCase()));
    return tasks;
  }

  onLogout() {
    localStorage.clear();
    this.router.navigate(['/']);
  }

  showChecks() {
    this.tasks.map(task => {
      task.checked = false;
    });
    this.checkAll = !this.checkAll;
  }

  async onDeleteChecked() {
    let sendTasks = [];
    this.tasks.forEach(task => {
      if (task.checked) sendTasks.push(task._id);
    });
    if (sendTasks.length === 0) return;
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
      this.getData();
    }).catch(async error => {
      let msgError = (error.message && error.message != '') ? error.message : (error.constructor === Object && Object.keys(error).length !== 0) ? JSON.stringify(error) : error;
      const toast = await this.toastController.create({
        color: 'danger',
        duration: 2000,
        message: msgError,
      });
      toast.present();
    });
    this.checkAll = false;
    await loading.dismiss();
  }

  async onChangeStatusChecked(status: string = 'Pendiente') {
    let sendTasks = [];
    this.tasks.forEach(task => {
      if (task.checked) sendTasks.push(task._id);
    });
    if (sendTasks.length === 0) return;
    const sendData = {
      'ids': sendTasks,
      'estatus': status
    }
    const loading = await this.loadingController.create({ message: 'Borrando...' });
    await loading.present();
    await fetchServer.call('tareas/changeStatus', 'POST', sendData).then(async response => {
      if (!response.ok) throw new Error(fetchServer.getTextError(response, 'Error al modificar el estatus de las tareas'));
      const toast = await this.toastController.create({
        color: 'primary',
        duration: 2000,
        message: response.data.msg,
      });
      toast.present();
      this.getData();
    }).catch(async error => {
      let msgError = (error.message && error.message != '') ? error.message : (error.constructor === Object && Object.keys(error).length !== 0) ? JSON.stringify(error) : error;
      const toast = await this.toastController.create({
        color: 'danger',
        duration: 2000,
        message: msgError,
      });
      toast.present();
    });
    this.checkAll = false;
    await loading.dismiss();
  }

  async onModalNew(){
    const modal = await this.modalController.create({
      component: ModalCreatePage,
      cssClass: 'custom-auto-height custom-auto-height-content-50',
      swipeToClose: true,
      componentProps: {
      }
    });

    modal.onDidDismiss().then((dataReturned) => {
      if (dataReturned) {
          this.getData();
      }
    });
    return await modal.present();
  }

  async showDetail(item){
    if(!item || item._id === undefined) return;
    const modal = await this.modalController.create({
      component: ModalEditPage,
      cssClass: 'custom-auto-height custom-auto-height-content-50',
      swipeToClose: true,
      componentProps: {
        'itemID': item._id
      }
    });

    modal.onDidDismiss().then((dataReturned) => {
      if (dataReturned) {
          this.getData();
      }
    });
    return await modal.present();
  }

}
