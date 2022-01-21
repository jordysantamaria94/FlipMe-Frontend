import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { AppComponent } from 'src/app/app.component';
import { GtagEvent } from 'src/app/models/gtag-event';
import { ResponseObject } from 'src/app/models/response-object';
import { FlipmeService } from 'src/app/services/flipme.service';
import { NavbarComponent } from 'src/app/shared/navbar/navbar.component';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-general-cards',
  templateUrl: './general-cards.component.html',
  styleUrls: ['./general-cards.component.css']
})
export class GeneralCardsComponent implements OnInit {

  idDeck: number | undefined;
  nameDeck: string | undefined;
  descriptionDeck: string | undefined;
  imageDeck: string | undefined;

  urlServer: string = environment.url;

  cards: any[] = [];

  currentPage: number = 1;
  dataPagination: any = [];

  constructor(
    private flipMeService: FlipmeService,
    private route: ActivatedRoute,
    private spinner: NgxSpinnerService,
    private app: AppComponent,
    private navbar: NavbarComponent) { }

  ngOnInit(): void {

    this.route.params.subscribe(param => {
      this.idDeck = param.deck;

      this.setVisitPage();
      this.getDeckInfo();
      this.getCardsDeck(this.currentPage);
    })
  }

  private setVisitPage(): void {
    const gtagEvent: GtagEvent = {
      name_event: 'user_cards_deck',
      params: {
        event_category: 'Visit',
        action: 'View',
        event_label: `/user/cards/deck/${this.idDeck!}`
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
          this.dataPagination = result.response;
          this.cards = result.response.data;
        }

        this.spinner.hide();
      }, err => {
        this.app.tokenExpiredToast();
        this.navbar.signOut();
        this.spinner.hide();
      });
  }

  removeElement = (id: number): void => {
    this.cards = this.cards.filter(card => card.id !== id)
  }

}
