import { Component, OnInit } from '@angular/core'
import { AppComponent } from 'src/app/app.component'
import { GtagEvent } from 'src/app/models/gtag-event'

@Component({
  selector: 'app-privacy-policy',
  templateUrl: './privacy-policy.component.html',
  styleUrls: ['./privacy-policy.component.css']
})
export class PrivacyPolicyComponent implements OnInit {

  constructor(private app: AppComponent) { }

  ngOnInit(): void {
    this.setVisitPage()
  }

  private setVisitPage(): void {
    const gtagEvent: GtagEvent = {
      name_event: 'visit_privacy_policy',
      params: {
        event_category: 'Visit',
        action: 'View',
        event_label: '/politica-privacidad'
      }
    }

    this.app.setEventAnalytics(gtagEvent)
  }

}
