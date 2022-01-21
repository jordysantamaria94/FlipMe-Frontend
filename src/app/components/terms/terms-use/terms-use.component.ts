import { Component, OnInit } from '@angular/core'
import { AppComponent } from 'src/app/app.component'
import { GtagEvent } from 'src/app/models/gtag-event'

@Component({
  selector: 'app-terms-use',
  templateUrl: './terms-use.component.html',
  styleUrls: ['./terms-use.component.css']
})
export class TermsUseComponent implements OnInit {

  constructor(private app: AppComponent) { }

  ngOnInit(): void {
    this.setVisitPage()
  }

  private setVisitPage(): void {
    const gtagEvent: GtagEvent = {
      name_event: 'visit_terms_use',
      params: {
        event_category: 'Visit',
        action: 'View',
        event_label: '/condiciones-servicio'
      }
    }

    this.app.setEventAnalytics(gtagEvent)
  }

}
