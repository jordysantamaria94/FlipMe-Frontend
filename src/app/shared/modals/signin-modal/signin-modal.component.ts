import { Component, Input, OnInit } from '@angular/core'
import { NgForm } from '@angular/forms'
import { Router } from '@angular/router'
import { SocialAuthService } from "angularx-social-login"
import { FacebookLoginProvider, GoogleLoginProvider } from 'angularx-social-login'
import { AppComponent } from 'src/app/app.component'
import { Sign } from 'src/app/models/sign'
import { FlipmeService } from 'src/app/services/flipme.service'
import { SharedService } from 'src/app/services/shared.service'
import * as moment from 'moment'
import { NgxSpinnerService } from 'ngx-spinner'
import { GtagEvent } from 'src/app/models/gtag-event'

declare var require: any

@Component({
  selector: 'app-signin-modal',
  templateUrl: './signin-modal.component.html',
  styleUrls: ['./signin-modal.component.css']
})
export class SigninModalComponent implements OnInit {

  today: string = moment().format()
  @Input() changeLogged: any

  constructor(
    private authService: SocialAuthService,
    private flipMeService: FlipmeService,
    private route: Router,
    private shared: SharedService,
    private app: AppComponent,
    private spinner: NgxSpinnerService) { }

  ngOnInit(): void {

    this.setVisitPage()

    this.authService.authState.subscribe((user) => {

      const form: Sign = {
        name: user.name,
        email: user.email,
        password: user.id,
        is_social: 1,
        social: user.authToken,
        created_at: this.today
      }

      this.checkUserExists(form)

    })
  }

  private setVisitPage(): void {
    const gtagEvent: GtagEvent = {
      name_event: 'visit_login',
      params: {
        event_category: 'Visit',
        action: 'View',
        event_label: '/signin'
      }
    }

    this.app.setEventAnalytics(gtagEvent)
  }

  signInWithGoogle(): void {
    this.authService.signIn(GoogleLoginProvider.PROVIDER_ID)
  }

  signInWithFB(): void {
    this.authService.signIn(FacebookLoginProvider.PROVIDER_ID)
  }

  signOut(): void {
    this.authService.signOut()
  }

  signIn(sendForm: NgForm): void {

    this.spinner.show()

    if (sendForm.value.email !== "" && sendForm.value.email !== "") {
      this.checkUserExists(sendForm.value)
    } else {

      this.spinner.hide()

      this.app.Toast.fire({
        icon: 'warning',
        title: "Es necesario llenar todos los campos"
      })
    }
  }

  checkUserExists(form: Sign): void {
    this.flipMeService.signIn(form)
      .subscribe((res: any) => {
        
        this.changeLogged(true)
        document.getElementById('closeSigninModal')?.click()

        const sign = require('jwt-encode')
        const secret = '$FlipMe@JS2021#'
        const jwt = sign(res.user, secret)

        localStorage.setItem('tkn', res.access_token)
        localStorage.setItem('token', jwt)
        // this.setLoginActionAnalytic()
        this.shared.broadcastLoggedStream(true)

        this.spinner.hide()
      }, err => {

        this.spinner.hide()

        this.app.Toast.fire({
          icon: 'error',
          title: err.error.message
        })
      })
  }

  private setLoginActionAnalytic(): void {
    const gtagEvent: GtagEvent = {
      name_event: 'login',
      params: {
        event_category: 'Login',
        action: 'Ingresar',
        event_label: '/signin'
      }
    }

    this.app.setEventAnalytics(gtagEvent)
  }
}
