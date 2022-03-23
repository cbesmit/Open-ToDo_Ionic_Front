import { Component, OnInit } from '@angular/core';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastController, LoadingController } from '@ionic/angular';
import fetchServer from '../../services/fetchServer';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  public frm: FormGroup;

  constructor(private formBuilder: FormBuilder,
    private router: Router,
    public toastController: ToastController,
    public loadingController: LoadingController
  ) {
    this.frm = this.formBuilder.group({
      usuario: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  ngOnInit() {
    let token = localStorage.getItem('tokenTodo');
    if (token) {
      this.router.navigate(['/list-tareas']);
    }
  }

  async loginForm() {
    const loading = await this.loadingController.create({message: 'Accediendo...'});
    await loading.present();
    await fetchServer.call('auth/login', 'POST', this.frm.value).then(response => {
      if (!response.ok) throw new Error(fetchServer.getTextError(response, 'Error al iniciar sesión'));
      localStorage.setItem('userNombre', response.data.data[0].nombre);
      localStorage.setItem('tokenTodo', response.data.data[0].token);
      this.router.navigate(['/list-tareas']);
        }).catch(async error => {
      localStorage.clear();
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
