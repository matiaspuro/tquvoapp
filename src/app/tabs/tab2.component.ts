import { Component, NgZone, ChangeDetectorRef, OnInit } from '@angular/core';

import { Router } from '@angular/router';

import { PrincipalService } from '../principal.service';
import { ToastController } from '@ionic/angular';
import { Location } from '@angular/common';

import * as moment from 'moment';

var timeout: any;
var toast: any;

@Component({
  selector: 'app-tab2',
  templateUrl: './tab2.component.html'
})


export class Tab2 implements OnInit {
  tokenVerificacion: string
  horaVencimiento: string
  expired: boolean = false
  loading:boolean =false

  constructor(private principalService: PrincipalService, public toastController: ToastController, private location: Location, private router: Router) { }

  ngOnInit() {

  }

  async presentToast() {
    toast = await this.toastController.create({
      message: 'Su token ha expirado por favor vuelva para renovarlo.',
      color: 'danger',
      position: 'top'
    });
    toast.present();
  }

  ionViewWillLeave() {

    clearTimeout(timeout);
    if (toast)
      toast.dismiss();
  }

  ionViewDidEnter() {
    clearTimeout(timeout);
    if (toast)
      toast.dismiss();
    let usuariosInfo = this.principalService.usuariosInfo;
    if (usuariosInfo.tokenVerificacion)
      this.tokenVerificacion = usuariosInfo.tokenVerificacion.slice(0, 2) + ' ' + usuariosInfo.tokenVerificacion.slice(2);
    this.horaVencimiento = moment(usuariosInfo.horaVencimientoToken).format("DD-MM-YYYY HH:mm");

    let end = moment(usuariosInfo.horaVencimientoToken);
    let now = moment(usuariosInfo.horaServidor);
    console.log(moment.duration(end.diff(now)).asSeconds())

    timeout = setTimeout(() => {
      this.presentToast();


    }, moment.duration(end.diff(now)).asSeconds() * 1000)

  }

  back() {
    this.location.back();
  }


  verificar() {
    this.loading = true;
    this.principalService.setVerification().subscribe(res => {
      this.loading = false;
      this.router.navigate(['/tab3'],{ replaceUrl: true })

    },err => {
      this.loading = false
    })

  }


}
