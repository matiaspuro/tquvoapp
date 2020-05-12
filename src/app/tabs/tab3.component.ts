import { Component, OnInit } from '@angular/core';

import { PrincipalService } from '../principal.service';
import { Router } from '@angular/router';

import { ToastController } from '@ionic/angular';

import * as moment from 'moment';

var timeout: any;
var toast: any;

@Component({
  selector: 'app-tab3',
  templateUrl: './tab3.component.html'
})
export class Tab3 implements OnInit {
  tokenPublico: string = ''
  horaVencimientoToken: string = ''
  nombre: string = ''
  email: string = ''
  dni: number
  loading: boolean = false


  constructor(private principalService: PrincipalService, private router: Router, public toastController: ToastController) { }

  ngOnInit() {

  }

  async presentToast() {
    toast = await this.toastController.create({
      message: 'Su token ha expirado por favor renuevelo.',
      color: 'danger',
      position: 'top'
    });
    toast.present();
  }

  ionViewDidEnter() {
    this.initialice()

  }

  ionViewWillLeave() {

    clearTimeout(timeout);
    if (toast)
      toast.dismiss();
  }


  initialice() {
    clearTimeout(timeout);
    if (toast)
      toast.dismiss();
    let usuariosInfo = this.principalService.usuariosInfo;
    if (usuariosInfo.tokenPublico)
      this.tokenPublico = usuariosInfo.tokenPublico.slice(0, 2) + ' ' + usuariosInfo.tokenPublico.slice(2);
    this.horaVencimientoToken = moment(usuariosInfo.horaVencimientoToken).format("DD-MM-YYYY HH:mm");
    this.nombre = usuariosInfo.nombre;
    this.email = usuariosInfo.email;
    this.dni = usuariosInfo.dni;

    let end = moment(usuariosInfo.horaVencimientoToken);
    let now = moment(usuariosInfo.horaServidor);
    console.log(moment.duration(end.diff(now)).asSeconds())

    timeout = setTimeout(() => {
      this.presentToast();


    }, moment.duration(end.diff(now)).asSeconds() * 1000)

  }


  verificar() {
    this.loading = true;
    this.principalService.setVerification().subscribe(res => {
      this.loading = false;
      this.initialice();
    }, err => {
      this.loading = false;
      if (err.status == 401)
        this.router.navigate(['/tab1'],{ replaceUrl: true });


    })

  }
}
