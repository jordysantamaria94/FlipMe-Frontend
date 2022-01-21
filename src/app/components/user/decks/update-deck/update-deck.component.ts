import { Component, OnInit } from '@angular/core'
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms'
import { ActivatedRoute, Router } from '@angular/router'
import { FlipmeService } from 'src/app/services/flipme.service'

import * as moment from 'moment'
import { AppComponent } from 'src/app/app.component'
import { environment } from 'src/environments/environment'
import { Decks } from 'src/app/models/decks'
import { NgxSpinnerService } from 'ngx-spinner'
import { GtagEvent } from 'src/app/models/gtag-event'
import { NavbarComponent } from 'src/app/shared/navbar/navbar.component'
import { ResponseObject } from 'src/app/models/response-object'
import { FormDeck } from 'src/app/models/forms/form-deck'

@Component({
  selector: 'app-update-deck',
  templateUrl: './update-deck.component.html',
  styleUrls: ['./update-deck.component.css']
})
export class UpdateDeckComponent implements OnInit {

  idDeck?: number
  file: any
  today: string = moment().format()

  urlServer: string = environment.url

  deckForm: FormGroup = new FormGroup({})

  constructor(
    private flipMeService: FlipmeService,
    private router: Router,
    private app: AppComponent,
    private route: ActivatedRoute,
    private spinner: NgxSpinnerService,
    private navbar: NavbarComponent,
    private fb: FormBuilder) { }

  ngOnInit(): void {

    this.route.params.subscribe(param => {
      this.idDeck = param.deck
      this.setVisitPage()
      this.getDeckInfo()
      this.prepareFormGroup()
    })
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
      name_event: 'user_deck_update_form',
      params: {
        event_category: 'Deck',
        action: 'Update Deck',
        event_label: `/user/deck/update/${this.idDeck!}`
      }
    }

    this.app.setEventAnalytics(gtagEvent)
  }

  private getDeckInfo(): void {

    this.spinner.show()

    this.flipMeService.getDeckUpdate(this.idDeck!)
      .subscribe((result: ResponseObject) => {

        if (result.success) {

          const deck = result.response as Decks

          this.deckForm.setValue({
            title: deck.name,
            description: deck.description,
            timer: deck.timer,
            private: deck.is_private
          })

          this.spinner.hide()
        } else {
          this.spinner.hide()
        }

      }, () => {
        this.app.tokenExpiredToast()
        this.navbar.signOut()
        this.spinner.hide()
      })
  }

  updateDeck(): void {

    if (this.deckForm.valid) {

      this.spinner.show()

      const formDeck: FormDeck = {
        id: this.idDeck,
        title: this.deckForm.controls.title.value,
        description: this.deckForm.controls.description.value,
        timer: this.deckForm.controls.timer.value,
        is_private: (this.deckForm.controls.private.value) ? 1 : 0,
        updated_at: this.today
      }

      this.flipMeService.updateDeck(formDeck, this.idDeck!)
        .subscribe((response: any) => {
          if (response.success) {
            this.setUpdateDeckActionAnalytic()
            this.app.successToast("Tu baraja ha sido actualizada exitosamente")
            this.spinner.hide()
            this.router.navigate(['/user/dashboard'])
          }
        }, err => {
          this.app.tokenExpiredToast()
          this.navbar.signOut()
          this.spinner.hide()
        })
    } else {
      this.app.warningToast("Es necesario llenar todos los campos")
    }
  }

  private setUpdateDeckActionAnalytic(): void {
    const gtagEvent: GtagEvent = {
      name_event: 'user_deck_update_action',
      params: {
        event_category: 'Deck',
        action: 'Actualizar',
        event_label: `/user/deck/update/${this.idDeck!}`
      }
    }

    this.app.setEventAnalytics(gtagEvent)
  }

}
