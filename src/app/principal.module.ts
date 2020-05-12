import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';
import  {Tab1 } from './tabs/tab1.component';
import  {Tab2 } from './tabs/tab2.component';
import  {Tab3 } from './tabs/tab3.component';

import { Principal } from './principal.component';
const routes: Routes = [
  {
    path: '',
    component: Principal
  },
  {
    path: 'tab1',
    component: Tab1
  },
  {
    path: 'tab2',
    component: Tab2
  },
  {
    path: 'tab3',
    component: Tab3
  }
];

@NgModule({
  imports: [
    CommonModule,
    
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [Principal,Tab1,Tab2,Tab3]
})
export class PrincipalModule {}
