import { Component, OnInit } from '@angular/core'
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms'
import { NgxSpinnerService } from 'ngx-spinner'
import { AppComponent } from 'src/app/app.component'
import { ResponseObject } from 'src/app/models/response-object'
import { User } from 'src/app/models/user'
import { FlipmeService } from 'src/app/services/flipme.service'
import { SharedService } from 'src/app/services/shared.service'
import { NavbarComponent } from 'src/app/shared/navbar/navbar.component'

@Component({
  selector: 'app-configuration',
  templateUrl: './configuration.component.html',
  styleUrls: ['./configuration.component.css']
})
export class ConfigurationComponent implements OnInit {

  id?: number

  userForm: FormGroup = new FormGroup({})

  constructor(
    private flipmeService: FlipmeService,
    private sharedService: SharedService,
    private spinner: NgxSpinnerService,
    private app: AppComponent,
    private navbar: NavbarComponent,
    private fb: FormBuilder) { }

  ngOnInit(): void {
    this.getUserInfo()
    this.prepareFormGroup()
  }

  private prepareFormGroup(): void {
    this.userForm = this.fb.group({
      name: [{ value: '', disabled: true }, Validators.required],
      email: [{ value: '', disabled: true }, Validators.required],
      newPassword: ['', Validators.required],
      repeat: ['', Validators.required],
    })
  }

  getUserInfo(): void {

    this.spinner.show()

    this.flipmeService.getUserInfo(this.sharedService.getIdUser())
      .subscribe((response: ResponseObject) => {

        if (response.success) {

          const user = response.response as User

          this.id = user.id

          this.userForm.setValue({
            name: user.name,
            email: user.email,
            newPassword: '',
            repeat: ''
          })

          this.spinner.hide()
        }
      }, () => {
        this.app.tokenExpiredToast()
        this.navbar.signOut()
        this.spinner.hide()
      })
  }

  updateConfig(): void {

    if (this.userForm.valid) {

      if (this.userForm.controls.newPassword.value === this.userForm.controls.repeat.value) {

        this.spinner.show()

        const form = {
          password: this.userForm.controls.newPassword.value
        }

        this.flipmeService.updatePasswordUser(this.id!, form)
          .subscribe((response: ResponseObject) => {

            if (response.success) {

              this.userForm.setValue({
                name: this.userForm.controls.name.value,
                email: this.userForm.controls.email.value,
                newPassword: '',
                repeat: ''
              })

              this.app.successToast("Tu información ha sido actualizada exitosamente")

              this.spinner.hide()
            } else {
              this.app.errorToast("Al parecer sucedio algo al tratar de actualizar tu información, intentalo nuevamente...")
              this.spinner.hide()
            }
          }, () => {
            this.app.tokenExpiredToast()
            this.navbar.signOut()
            this.spinner.hide()
          })
      } else {
        this.app.warningToast("Las contraseñas deben coincidir para actualizar la contraseña")
      }
    }

  }

}
