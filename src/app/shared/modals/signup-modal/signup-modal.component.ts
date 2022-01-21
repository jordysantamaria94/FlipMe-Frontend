import { Component, Input, OnInit } from '@angular/core';
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

@Component({
  selector: 'app-signup-modal',
  templateUrl: './signup-modal.component.html',
  styleUrls: ['./signup-modal.component.css']
})
export class SignupModalComponent implements OnInit {

  today: string = moment().format();
  @Input() changeLogged: any;

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

    if (sendForm.value.email !== "" && sendForm.value.email !== "" && sendForm.value.password !== "") {

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

          this.changeLogged(true);
          localStorage.setItem('token', res.token);
          this.shared.broadcastLoggedStream(res.token);
          this.spinner.hide();
        }
      }, err => {

        this.spinner.hide();

        this.app.Toast.fire({
          icon: 'error',
          title: err.error.message
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
