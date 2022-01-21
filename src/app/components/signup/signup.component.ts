import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { SocialAuthService } from "angularx-social-login";
import { FacebookLoginProvider, GoogleLoginProvider } from 'angularx-social-login';
import { FlipmeService } from 'src/app/services/flipme.service';
import { SharedService } from 'src/app/services/shared.service';
import { AppComponent } from 'src/app/app.component';

import * as moment from 'moment';
import { Sign } from 'src/app/models/sign';
import { NgxSpinnerService } from 'ngx-spinner';
import { GtagEvent } from 'src/app/models/gtag-event';
import { Error } from 'src/app/models/error';

declare var require: any

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {

  today: string = moment().format();

  constructor(
    private authService: SocialAuthService,
    private flipMeService: FlipmeService,
    private shared: SharedService,
    private route: Router,
    private app: AppComponent,
    private spinner: NgxSpinnerService) { }

  ngOnInit(): void {
    this.setVisitPage();
    this.authService.authState.subscribe((user) => {

      const form: Sign = {
        name: user.name,
        email: user.email,
        password: user.id,
        is_social: 1,
        social: user.authToken,
        created_at: this.today
      }

      this.recordUser(form);
    });
  }

  private setVisitPage() {
    const gtagEvent: GtagEvent = {
      name_event: 'visit_signup',
      params: {
        event_category: 'Visit',
        action: 'View',
        event_label: '/signup'
      }
    }

    this.app.setEventAnalytics(gtagEvent);
  }

  signUp(sendForm: NgForm): void {

    this.spinner.show();

    if (sendForm.value.name !== "" && sendForm.value.email !== "" && sendForm.value.password !== "") {

      let form: Sign = sendForm.value;

      form.is_social = 0;
      form.social = "";
      form.created_at = this.today;

      this.recordUser(form);
    } else {

      this.spinner.hide();

      this.app.Toast.fire({
        icon: 'warning',
        title: "Es necesario llenar todos los campos"
      });
    }
  }

  recordUser(form: Sign): void {
    this.flipMeService.signUp(form)
      .subscribe((res: any) => {
        if (res.success) {

          this.setSignupActionAnalytic();

          this.app.Toast.fire({
            icon: 'success',
            title: "Te has registrado exitosamente"
          });

          const sign = require('jwt-encode');
          const secret = '$FlipMe@JS2021#';
          const jwt = sign(res.user, secret);

          localStorage.setItem('tkn', res.access_token);
          localStorage.setItem('token', jwt);

          this.shared.broadcastLoggedStream(true);
          this.spinner.hide();
          this.route.navigate(['user/dashboard']);
        }
      }, (err: Error) => {

        this.spinner.hide();

        this.app.Toast.fire({
          icon: 'error',
          title: (err.error?.errors) ? err.error.errors.email![0] : err.error!.message
        });
      });
  }

  private setSignupActionAnalytic(): void {
    const gtagEvent: GtagEvent = {
      name_event: 'signup',
      params: {
        event_category: 'SignUp',
        action: 'Crear cuenta',
        event_label: '/signup'
      }
    }

    this.app.setEventAnalytics(gtagEvent);
  }

  signInWithGoogle(): void {
    this.authService.signIn(GoogleLoginProvider.PROVIDER_ID);
  }

  signInWithFB(): void {
    this.authService.signIn(FacebookLoginProvider.PROVIDER_ID);
  }

  signOut(): void {
    this.authService.signOut();
  }

}
