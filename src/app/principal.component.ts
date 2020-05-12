import { Component, OnInit } from '@angular/core';

import { PrincipalService } from './principal.service';
import { Router } from "@angular/router"

@Component({
    selector: 'app-principal',
    templateUrl: './principal.component.html'
})
export class Principal implements OnInit {

    constructor(private principalService: PrincipalService, private router: Router) { }

    async ngOnInit() {

       


    }

    async ionViewDidEnter() {
        await this.principalService.initializeApp();
        let usuarioInfo = this.principalService.usuariosInfo;
        console.log(usuarioInfo);

        this.principalService.setVerification()
            .subscribe(res => {

            this.router.navigate(['/tab3'])

            }, err => {
               
              this.router.navigate(['/tab1'])

            })


    
      }

}