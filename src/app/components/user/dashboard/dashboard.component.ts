import { Component, OnInit } from '@angular/core'
import { FlipmeService } from 'src/app/services/flipme.service'
import decode from 'jwt-decode'
import { NgxSpinnerService } from 'ngx-spinner'
import { AppComponent } from 'src/app/app.component'
import { GtagEvent } from 'src/app/models/gtag-event'
import { SharedService } from 'src/app/services/shared.service'
import { NavbarComponent } from 'src/app/shared/navbar/navbar.component'
import { ResponsePagination } from 'src/app/models/response-pagination'
import { ResponseArray } from 'src/app/models/response-array'
import { ResponseObject } from 'src/app/models/response-object'
import { Decks } from 'src/app/models/decks'

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  name: string = "N/D"
  decks: Decks[] = []

  currentPage: number = 1
  dataPagination?: ResponsePagination

  constructor(
    private flipMeService: FlipmeService,
    private spinner: NgxSpinnerService,
    private app: AppComponent,
    private shared: SharedService,
    private navbar: NavbarComponent) { }

  ngOnInit(): void {
    this.setVisitPage()
    this.getMyDecks(this.currentPage)
    this.loadPersonalData()
  }

  private setVisitPage(): void {
    const gtagEvent: GtagEvent = {
      name_event: 'user_dashboard',
      params: {
        event_category: 'Visit',
        action: 'View',
        event_label: '/user/dashboard'
      }
    }

    this.app.setEventAnalytics(gtagEvent)
  }

  getMyDecks = (page: number): void => {

    this.spinner.show()

    this.flipMeService.getDashboard(this.shared.getIdUser(), page)
      .subscribe((result: ResponseObject) => {

        if (result.success) {

          const paginationObject: ResponsePagination = result.response

          this.dataPagination = paginationObject
          this.decks = paginationObject.data!
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

  private loadPersonalData(): void {
    const token = localStorage.getItem('token')

    if (token !== undefined) {
      const tokenPayload: any = decode(token!)
      this.name = tokenPayload.name
    }
  }
}
