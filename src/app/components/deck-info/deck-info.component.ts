import { Component, OnInit } from '@angular/core'
import { ActivatedRoute, Router } from '@angular/router'
import { NgxSpinnerService } from 'ngx-spinner'
import { AppComponent } from 'src/app/app.component'
import { DeckInfo } from 'src/app/models/deck-info'
import { GtagEvent } from 'src/app/models/gtag-event'
import { PreviewDeck } from 'src/app/models/preview-deck'
import { ResponseArray } from 'src/app/models/response-array'
import { FlipmeService } from 'src/app/services/flipme.service'
import { environment } from 'src/environments/environment'

@Component({
  selector: 'app-deck-info',
  templateUrl: './deck-info.component.html',
  styleUrls: ['./deck-info.component.css']
})
export class DeckInfoComponent implements OnInit {

  id: number | undefined
  title: string | undefined
  description: string | undefined
  createdby: string | undefined
  cardsPreview: PreviewDeck[] = []

  urlServer: string = environment.url
  isLogged: boolean = false

  constructor(
    private flipmeService: FlipmeService,
    public route: ActivatedRoute,
    private router: Router,
    private spinner: NgxSpinnerService,
    private app: AppComponent) {

    route.params.subscribe(params => {
      this.id = params['id']
      this.isLogged = (localStorage.getItem("token") ? true : false)
    })
  }

  ngOnInit(): void {
    this.setVisitPage()
    this.getPreviewCards()
  }

  private setVisitPage(): void {
    const gtagEvent: GtagEvent = {
      name_event: 'visit_deck_info',
      params: {
        event_category: 'Visit',
        action: 'View',
        event_label: `/deck/${this.id}`
      }
    }

    this.app.setEventAnalytics(gtagEvent)
  }

  private getPreviewCards(): void {

    this.spinner.show()

    this.flipmeService.getPreviewCards(this.id!)
      .subscribe((result: ResponseArray) => {

        if (result.success) {
          
          const deckInfo: DeckInfo = result.response as DeckInfo

          this.title = deckInfo.deck.name
          this.description = deckInfo.deck.description
          this.createdby = deckInfo.deck.created_by

          if (deckInfo.cards) {
            this.cardsPreview = deckInfo.cards
          } else {
            this.app.warningToast('Esta baraja aun no contiene cartas, intenta con una diferente')
            this.router.navigate(['/'])
          }

          this.spinner.hide()
        } else {
          this.spinner.hide()
        }
      }, err => {
        this.spinner.hide()
      })
  }

  changeLogged = (isLogged: boolean) => {
    this.isLogged = isLogged
  }

}
