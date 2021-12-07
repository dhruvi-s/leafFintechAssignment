import { NgModule } from '@angular/core';
import { CommonModule, } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { Routes, RouterModule } from '@angular/router';
import { AdminLayoutComponent } from './layouts/admin-layout/admin-layout.component';
import { Screen1Component } from './leaffintech/screen1/screen1.component';

const routes: Routes = [
  { path: 'screen', component: Screen1Component },
  // { path: 'register', component: RegisterComponent },
  // { path: 'device', component: DeviceComponent },
  // { path: 'group', component: GroupComponent },
  {
    path: '',
    redirectTo: 'screen',
    pathMatch: 'full',
  }, {
    path: '',
    component: AdminLayoutComponent,
    canActivate: [],
    children: [{
      path: '',
      loadChildren: './layouts/admin-layout/admin-layout.module#AdminLayoutModule'
    }]
  }
];

@NgModule({
  imports: [
    CommonModule,
    BrowserModule,
    RouterModule.forRoot(routes, {
      useHash: true
    })
  ],
  exports: [RouterModule],
})
export class AppRoutingModule { }
