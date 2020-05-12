import { Component, OnInit } from '@angular/core';

import { PrincipalService } from '../principal.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-tab1',
  templateUrl: './tab1.component.html'
})
export class Tab1 implements OnInit {
  loading:boolean = false

  constructor(private principalService: PrincipalService, private router: Router) { }

  ngOnInit() {

  }

  async handleSubmit(e, dni) {
    e.preventDefault();
    this.loading = true;
    this.principalService.setVerification().subscribe(res_ver => {
      this.loading= false;
      this.router.navigate(['/tab3'],{ replaceUrl: true })



    }, err => {
      this.principalService.setRegistration(dni).subscribe(res => {
        this.loading= false;
        this.principalService.setToken()
          .then(res2 => this.router.navigate(['/tab2'],{ replaceUrl: true }))

      },err => {
        this.loading= false;

      });

    })



  }




}
