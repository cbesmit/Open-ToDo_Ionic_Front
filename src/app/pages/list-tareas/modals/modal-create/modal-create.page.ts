import { Component, OnInit } from '@angular/core'
import { ModalController } from '@ionic/angular';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { ToastController, LoadingController } from '@ionic/angular';
import fetchServer from '../../../../services/fetchServer';

@Component({
  selector: 'app-modal-create',
  templateUrl: './modal-create.page.html',
  styleUrls: ['./modal-create.page.scss'],
})
export class ModalCreatePage implements OnInit {
  public frm: FormGroup;

  constructor(private modalController: ModalController,
    private formBuilder: FormBuilder,
    public toastController: ToastController,
    public loadingController: LoadingController
  ) {
    this.frm = this.formBuilder.group({
      titulo: ['', Validators.required],
      detalle: [''],
      fechaVencimiento: [''],
    });
   }

  ngOnInit() {
  }

  async closeModal(actualizar: boolean = false) {
    await this.modalController.dismiss(actualizar);
  }

  async onSave() {
    const dataSend = this.frm.value;
    const loading = await this.loadingController.create({ message: 'Creando...' });
    await loading.present();
    await fetchServer.call('tareas/create', 'POST', dataSend).then(async response => {
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
