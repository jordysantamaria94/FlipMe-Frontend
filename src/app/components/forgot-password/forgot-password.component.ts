import { Component, OnInit } from '@angular/core'
import { NgForm } from '@angular/forms'
import { Router } from '@angular/router'
import { NgxSpinnerService } from 'ngx-spinner'
import { AppComponent } from 'src/app/app.component'
import { FlipmeService } from 'src/app/services/flipme.service'
import * as moment from 'moment'

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent implements OnInit {

  today: string = moment().format()

  constructor(
    private spinner: NgxSpinnerService, 
    private app: AppComponent, 
    private flipMeService: FlipmeService,
    private router: Router) { }

  ngOnInit(): void {
  }

  recover(sendForm: NgForm): void {

    this.spinner.show()

    if (sendForm.value.email !== "") {

      const form = {
        email: sendForm.value.email,
        created_at: this.today
      }
      
      this.flipMeService.forgotPassword(form)
        .subscribe((res: any) => {
          if (res.success) {
            this.spinner.hide()
            this.router.navigate(['signin'])
          } else {
            this.spinner.hide()
          }
        })
      
    } else {

      this.spinner.hide()

      this.app.Toast.fire({
        icon: 'warning',
        title: "Es necesario llenar todos los campos"
      })
    }
  }

}
