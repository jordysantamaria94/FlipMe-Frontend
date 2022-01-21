import { Component, OnInit } from '@angular/core'
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms'
import { ActivatedRoute } from '@angular/router'
import { FlipmeService } from 'src/app/services/flipme.service'
import { AppComponent } from 'src/app/app.component'
import { Location } from '@angular/common'

import * as moment from 'moment'
import { NgxSpinnerService } from 'ngx-spinner'
import { GtagEvent } from 'src/app/models/gtag-event'
import { NavbarComponent } from 'src/app/shared/navbar/navbar.component'
import { FormCard } from 'src/app/models/forms/form-card'
import { ResponseObject } from 'src/app/models/response-object'

@Component({
  selector: 'app-add-card',
  templateUrl: './add-card.component.html',
  styleUrls: ['./add-card.component.css']
})
export class AddCardComponent implements OnInit {

  idDeck: number | undefined
  today: string = moment().format()

  cardForm: FormGroup = new FormGroup({})

  constructor(
    private flipMeService: FlipmeService,
    private navbar: NavbarComponent,
    private route: ActivatedRoute,
    private app: AppComponent,
    private location: Location,
    private spinner: NgxSpinnerService,
    private fb: FormBuilder) {

    this.route.params.subscribe(param => {
      this.idDeck = param.deck
    })
  }

  ngOnInit(): void {
    this.setVisitPage()
    this.prepareFormGroup()
  }

  private prepareFormGroup(): void {
    this.cardForm = this.fb.group({
      question: ['', Validators.required],
      answerOne: ['', Validators.required],
      answerTwo: ['', Validators.required],
      answerThree: ['', Validators.required],
      radioAnswer: ['1', Validators.required],
      descriptionAnswer: [''],
    })
  }

  private setVisitPage(): void {
    const gtagEvent: GtagEvent = {
      name_event: 'user_card_add_form',
      params: {
        event_category: 'Card',
        action: 'New Card',
        event_label: `/user/card/add/${this.idDeck!}`
      }
    }

    this.app.setEventAnalytics(gtagEvent)
  }

  createCard(): void {

    if (this.cardForm.valid) {

      this.spinner.show()

      const answerArray: { answer: string, is_true: boolean }[] = []

      this._addAnswer(answerArray, this.cardForm.controls.answerOne.value, this.cardForm.controls.radioAnswer.value, "1")
      this._addAnswer(answerArray, this.cardForm.controls.answerTwo.value, this.cardForm.controls.radioAnswer.value, "2")
      this._addAnswer(answerArray, this.cardForm.controls.answerThree.value, this.cardForm.controls.radioAnswer.value, "3")

      const cardForm: FormCard = {
        id_deck: this.idDeck,
        question: this.cardForm.controls.question.value,
        answer: JSON.stringify(answerArray),
        desc_answer: this.cardForm.controls.descriptionAnswer.value,
        created_at: this.today
      }

      this.flipMeService.createCard(cardForm)
        .subscribe((response: ResponseObject) => {
          
          if (response.success) {
            this.setAddCardActionAnalytic()
            this.app.successToast("Tarjeta registrada exitosamente")
            this.spinner.hide()
            this.location.back()
          }
        }, err => {
          this.app.tokenExpiredToast()
          this.navbar.signOut()
          this.spinner.hide()
        })
    }
  }

  private _addAnswer(answerArray: { answer: string, is_true: boolean }[], answer: string, radioAnswerTrue: string, is_true: string) {
    answerArray.push({
      answer: answer,
      is_true: (radioAnswerTrue === is_true)
    })
  }

  private setAddCardActionAnalytic(): void {
    const gtagEvent: GtagEvent = {
      name_event: 'user_card_add_action',
      params: {
        event_category: 'Card',
        action: 'Crear carta',
        event_label: `/user/card/add/${this.idDeck!}`
      }
    }

    this.app.setEventAnalytics(gtagEvent)
  }

}
