import { Component, OnInit } from '@angular/core'
import { FormBuilder, FormControl, FormGroup, NgForm, Validators } from '@angular/forms'
import { Router } from '@angular/router'
import { FlipmeService } from 'src/app/services/flipme.service'

import * as moment from 'moment'
import { AppComponent } from 'src/app/app.component'
import { NgxImageCompressService } from 'ngx-image-compress'
import { NgxSpinnerService } from 'ngx-spinner'
import { GtagEvent } from 'src/app/models/gtag-event'
import { SharedService } from 'src/app/services/shared.service'
import { NavbarComponent } from 'src/app/shared/navbar/navbar.component'
import { FormDeck } from 'src/app/models/forms/form-deck'
import { ResponseObject } from 'src/app/models/response-object'

@Component({
  selector: 'app-add-deck',
  templateUrl: './add-deck.component.html',
  styleUrls: ['./add-deck.component.css']
})
export class AddDeckComponent implements OnInit {

  file: any
  image: any
  today: string = moment().format()

  deckForm: FormGroup = new FormGroup({})

  constructor(
    private flipMeService: FlipmeService,
    private router: Router,
    private app: AppComponent,
    private imageCompress: NgxImageCompressService,
    private spinner: NgxSpinnerService,
    private shared: SharedService,
    private navbar: NavbarComponent,
    private fb: FormBuilder) { }

  ngOnInit(): void {
    this.setVisitPage()
    this.prepareFormGroup()
  }

  private prepareFormGroup(): void {
    this.deckForm = this.fb.group({
      title: ['', [Validators.required]],
      description: ['', Validators.required],
      timer: ['', Validators.required],
      private: [false]
    })
  }

  private setVisitPage(): void {
    const gtagEvent: GtagEvent = {
      name_event: 'user_deck_add_form',
      params: {
        event_category: 'Deck',
        action: 'New Deck',
        event_label: '/user/deck/add'
      }
    }

    this.app.setEventAnalytics(gtagEvent)
  }

  createDeck(): void {

    if (this.deckForm.valid) {

      this.spinner.show()

      const formDeck: FormDeck = {
        id_user: this.shared.getIdUser(),
        title: this.deckForm.controls.title.value,
        description: this.deckForm.controls.description.value,
        timer: this.deckForm.controls.timer.value,
        is_private: (this.deckForm.controls.private.value) ? 1 : 0,
        created_at: this.today
      }

      this.flipMeService.createDeck(formDeck)
        .subscribe((response: ResponseObject) => {
          if (response.success) {
            this.setAddDeckActionAnalytic()
            this.app.successToast("Tu baraja ha sido registrada exitosamente")
            this.spinner.hide()
            this.router.navigate(['/user/dashboard'])
          }
        }, err => {
          this.app.tokenExpiredToast()
          this.navbar.signOut()
          this.spinner.hide()
        })

    }
  }

  fileBrowseHandler(event: any): void {

    var reader = new FileReader()
    reader.readAsDataURL(event.target.files[0])
    reader.onload = (_event) => {

      const image64Bits: any = reader.result

      this.imageCompress.compressFile(image64Bits, 50, 50).then(image => {
        this.image = image
      })
    }

    this.file = event.target.files[0]
  }

  private setAddDeckActionAnalytic(): void {
    const gtagEvent: GtagEvent = {
      name_event: 'user_deck_add_action',
      params: {
        event_category: 'Deck',
        action: 'Crear',
        event_label: '/user/deck/add'
      }
    }

    this.app.setEventAnalytics(gtagEvent)
  }

}
