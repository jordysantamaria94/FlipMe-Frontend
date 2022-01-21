import { Component, OnInit } from '@angular/core'
import { NgxSpinnerService } from 'ngx-spinner'
import { AppComponent } from 'src/app/app.component'
import { AllDecks } from 'src/app/models/all-decks'
import { Decks } from 'src/app/models/decks'
import { GtagEvent } from 'src/app/models/gtag-event'
import { ResponseArray } from 'src/app/models/response-array'
import { FlipmeService } from 'src/app/services/flipme.service'

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {

  favsDecks: Decks[] = []
  OriginalsDecks: Decks[] = []
  recentlysDecks: Decks[] = []

  constructor(
    private flipmeService: FlipmeService,
    private spinner: NgxSpinnerService,
    private app: AppComponent) { }

  ngOnInit(): void {
    this.setVisitPage()
    this.getAllDecks()
  }

  private setVisitPage(): void {
    const gtagEvent: GtagEvent = {
      name_event: 'visit_main',
      params: {
        event_category: 'Visit',
        action: 'View',
        event_label: '/'
      }
    }

    this.app.setEventAnalytics(gtagEvent)
  }

  private getAllDecks(): void {

    this.spinner.show()

    this.flipmeService.getAllDecks()
      .subscribe((result: ResponseArray) => {

        if (result.success) {

          const decks: AllDecks = result.response as AllDecks

          this.favsDecks = decks.favs!
          this.OriginalsDecks = decks.originals!
          this.recentlysDecks = decks.recentlys!

          this.spinner.hide()
        } else {
          this.spinner.hide()
        }
      }, () => {
        this.spinner.hide()
      });
  }

}
