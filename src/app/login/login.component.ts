import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {AlertService, AuthenticationService} from '../_services/index';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {JsonPipe} from '@angular/common';
// import { BoshClient, $build } from "xmpp-bosh-client/browser";

declare var $: any;
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})

export class LoginComponent implements OnInit {

    model: any = {};
    loading = false;
    returnUrl: string;
    message: string;
    err: string;
    public selected;
    public isje = '';
    loginForm: FormGroup;
    // client : BoshClient;

    constructor(
        private formBuilder : FormBuilder,
        private route : ActivatedRoute,
        private router : Router,
        private authenticationService : AuthenticationService,
        private alertService : AlertService
    ) {}

    ngOnInit(): void {
      this.authenticationService.logout();
      this.loginForm = this.formBuilder.group({
        email: ['', Validators.required],
        password: ['', Validators.required]
      });
        // get return url from route parameters or default to '/'
        this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
    }

    // convenience getter for easy access to form fields
    get f() {
        return this.loginForm.controls;
    }


    signUp() {
        console.log("navigate Signup");
        this.router.navigate(['/signup']);
    }

    login() {
      if (this.loginForm.invalid) {
        return;
      } else {
        this.loading = true;
        this.authenticationService.login(this.loginForm.value)
          .subscribe(
            data => {
              if(data.status == 200) {
                localStorage.setItem('currentUser', JSON.stringify(data));
                localStorage.setItem('isLoggedIn', 'true');
                this.router.navigate([this.returnUrl]);
              } else {
                this.alertService.error(data.message);
                console.log('fail', data.message);
                this.loading = false;
                this.showNotification('bottom', 'right', 'warning', data.message, 'announcement');
                }
                
              },
              error => {
                this.alertService.error(error);
                console.log('fail', error);
                this.loading = false;
                this.showNotification('bottom', 'right', 'warning', error.message, 'announcement');
              });
        }
      }

    // forgetPassword() {
    //     this.router.navigate(['/reset']);
    // }
    showNotification(from, align, color, stringMessage, icons) {
        const type = ['', 'info', 'success', 'warning', 'danger'];

        $.notify({
            icon: icons,
            message: stringMessage

        }, {
            type: type[color],
            timer: 4000,
            placement: {
                from: from,
                align: align
            },
            template: '<div data-notify="container" class="col-xl-4 col-lg-4 col-11 col-sm-4 col-md-4' +
                    ' alert alert-{0} alert-with-icon" role="alert"><button mat-button  type="butto' +
                    'n" aria-hidden="true" class="close mat-button" data-notify="dismiss">  <i clas' +
                    's="material-icons">close</i></button><i class="material-icons" data-notify="ic' +
                    'on">notifications</i> <span data-notify="title">{1}</span> <span data-notify="' +
                    'message">{2}</span><div class="progress" data-notify="progressbar"><div class=' +
                    '"progress-bar progress-bar-{0}" role="progressbar" aria-valuenow="0" aria-valu' +
                    'emin="0" aria-valuemax="100" style="width: 0%;"></div></div><a href="{3}" targ' +
                    'et="{4}" data-notify="url"></a></div>'
        });
    }

}
