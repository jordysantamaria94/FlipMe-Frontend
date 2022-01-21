import { Component, OnInit } from '@angular/core'
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms'
import { ActivatedRoute, Router } from '@angular/router'
import { FlipmeService } from 'src/app/services/flipme.service'
import { AppComponent } from 'src/app/app.component'
import { Location } from '@angular/common'

import * as moment from 'moment'
import { NgxSpinnerService } from 'ngx-spinner'
import { GtagEvent } from 'src/app/models/gtag-event'
import { NavbarComponent } from 'src/app/shared/navbar/navbar.component'
import { ResponseObject } from 'src/app/models/response-object'
import { FormCard } from 'src/app/models/forms/form-card'


@Component({
  selector: 'app-update-card',
  templateUrl: './update-card.component.html',
  styleUrls: ['./update-card.component.css']
})
export class UpdateCardComponent implements OnInit {

  idCard?: number
  cardForm: FormGroup = new FormGroup({})
  today: string = moment().format()

  constructor(
    private flipMeService: FlipmeService,
    private navbar: NavbarComponent,
    private route: ActivatedRoute,
    private app: AppComponent,
    private location: Location,
    private spinner: NgxSpinnerService,
    private fb: FormBuilder) { }

  ngOnInit(): void {
    this.route.params.subscribe(param => {
      this.idCard = param.card

      this.setVisitPage()
      this.prepareFormGroup()
      this.getInfoCard()
    })
  }

  private prepareFormGroup(): void {
    this.cardForm = this.fb.group({
      question: ['', Validators.required],
      answerOne: ['', Validators.required],
      answerTwo: ['', Validators.required],
      answerThree: ['', Validators.required],
      radioAnswer: ['1', Validators.required],
      descriptionAnswer: ['']
    })
  }

  private setVisitPage(): void {
    const gtagEvent: GtagEvent = {
      name_event: 'user_card_update_form',
      params: {
        event_category: 'Card',
        action: 'New Card',
        event_label: `/user/card/update/${this.idCard!}`
      }
    }

    this.app.setEventAnalytics(gtagEvent)
  }

  private getInfoCard(): void {

    this.spinner.show()

    this.flipMeService.getCardInfo(this.idCard!)
      .subscribe((result: ResponseObject) => {

        if (result.success) {

          const answers: any[] = JSON.parse(result.response.answer)
          const radio = answers.findIndex(answer => answer.is_true === true)

          this.cardForm.setValue({
            question: result.response.question,
            answerOne: answers[0].answer,
            answerTwo: answers[1].answer,
            answerThree: answers[2].answer,
            radioAnswer: String(radio + 1),
            descriptionAnswer: result.response.desc_answer
          })
        }

        this.spinner.hide()
      }, err => {
        this.app.tokenExpiredToast()
        this.navbar.signOut()
        this.spinner.hide()
      })
  }

  updateCard(): void {

    if (this.cardForm.valid) {

      this.spinner.show()

      const answerArray: { answer: string, is_true: boolean }[] = []

      this._addAnswer(answerArray, this.cardForm.controls.answerOne.value, this.cardForm.controls.radioAnswer.value, "1")
      this._addAnswer(answerArray, this.cardForm.controls.answerTwo.value, this.cardForm.controls.radioAnswer.value, "2")
      this._addAnswer(answerArray, this.cardForm.controls.answerThree.value, this.cardForm.controls.radioAnswer.value, "3")

      const cardFormObject: FormCard = {
        id_card: this.idCard,
        question: this.cardForm.controls.question.value,
        answer: JSON.stringify(answerArray),
        desc_answer: this.cardForm.controls.descriptionAnswer.value,
        updated_at: this.today
      }

      this.flipMeService.updateCard(cardFormObject, this.idCard!)
        .subscribe((response: ResponseObject) => {
          if (response.success) {
            this.setUpdateCardActionAnalytic()
            this.app.successToast("Tarjeta actualizada exitosamente")
            this.spinner.hide()
            this.location.back()
          }
        }, err => {
          this.app.tokenExpiredToast()
          this.navbar.signOut()
          this.spinner.hide()
        })
    } else {
      this.app.warningToast("Es necesario llenar todos los campos y seleccionar cual es la respuesta correcta")
    }
  }

  private _addAnswer(answerArray: { answer: string, is_true: boolean }[], answer: string, radioAnswerTrue: string, is_true: string) {
    answerArray.push({
      answer: answer,
      is_true: (radioAnswerTrue === is_true)
    })
  }

  private setUpdateCardActionAnalytic(): void {
    const gtagEvent: GtagEvent = {
      name_event: 'user_card_update_action',
      params: {
        event_category: 'Card',
        action: 'Actualizar carta',
        event_label: `/user/card/update/${this.idCard!}`
      }
    }

    this.app.setEventAnalytics(gtagEvent)
  }

}
