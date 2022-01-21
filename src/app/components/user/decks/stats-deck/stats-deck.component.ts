import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import * as moment from 'moment';
import { NgxSpinnerService } from 'ngx-spinner';
import { AppComponent } from 'src/app/app.component';
import { GtagEvent } from 'src/app/models/gtag-event';
import { ResponseArray } from 'src/app/models/response-array';
import { ResponseObject } from 'src/app/models/response-object';
import { ResponsePagination } from 'src/app/models/response-pagination';
import { FlipmeService } from 'src/app/services/flipme.service';
import { NavbarComponent } from 'src/app/shared/navbar/navbar.component';

@Component({
  selector: 'app-stats-deck',
  templateUrl: './stats-deck.component.html',
  styleUrls: ['./stats-deck.component.css']
})
export class StatsDeckComponent implements OnInit {

  idDeck: number | undefined;
  nameDeck: string | undefined;
  descriptionDeck: string | undefined;
  imageDeck: string | undefined;

  stats: any[] = [];
  cards: number = 0;

  currentPage: number = 1;
  dataPagination: any = [];

  constructor(
    private flipMeService: FlipmeService,
    private route: ActivatedRoute,
    private spinner: NgxSpinnerService,
    private app: AppComponent,
    private navbar: NavbarComponent) {
  }

  ngOnInit(): void {
    this.route.params.subscribe(param => {
      this.idDeck = param.deck;

      this.setVisitPage();
      this.getDeckInfo();
      this.getAllStatsDeck(this.currentPage);
      this.getCardsDeck(this.currentPage);
    })
  }

  private setVisitPage(): void {
    const gtagEvent: GtagEvent = {
      name_event: 'user_stats_deck',
      params: {
        event_category: 'Visit',
        action: 'View',
        event_label: `/user/deck/stats/${this.idDeck!}`
      }
    }

    this.app.setEventAnalytics(gtagEvent);
  }

  private getDeckInfo(): void {

    this.spinner.show();

    this.flipMeService.getDeckInfo(this.idDeck!)
      .subscribe((result: ResponseObject) => {
        if (result.success) {
          this.nameDeck = result.response.name;
          this.descriptionDeck = result.response.description;
          this.imageDeck = result.response.image;
        }
      }, err => {
        this.app.tokenExpiredToast();
        this.navbar.signOut();
        this.spinner.hide();
      });
  }

  getAllStatsDeck = (page: number): void => {
    this.flipMeService.getAllStatsDeck(this.idDeck!, page)
      .subscribe((result: ResponseObject) => {

        if (result.success) {

          const paginationObject: ResponsePagination = result.response

          this.dataPagination = paginationObject
          this.stats = paginationObject.data!

          this.spinner.hide()
        } else {
          this.spinner.hide()
        }

      }, () => {
        this.app.tokenExpiredToast();
        this.navbar.signOut();
        this.spinner.hide();
      });
  }

  getCardsDeck = (page: number): void => {

    this.flipMeService.getCardsDeck(this.idDeck!, page)
      .subscribe((result: ResponseObject) => {

        if (result.success) {
          this.cards = result.response.data.length;
          this.spinner.hide();
        } else {
          this.spinner.hide();
        }
        
      }, err => {
        this.app.tokenExpiredToast();
        this.navbar.signOut();
        this.spinner.hide();
      });
  }

  convertDate(date: string): string {
    console.log(date);
    return moment(date).format('DD MMMM YYYY') + " a las " + moment(date).format('h:mm a');
  }
}
