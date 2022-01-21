import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CardPlay } from 'src/app/models/card-play';
import { Stats } from 'src/app/models/stats';
import { FlipmeService } from 'src/app/services/flipme.service';
import * as moment from 'moment';
import { NgxSpinnerService } from 'ngx-spinner';
import { AppComponent } from 'src/app/app.component';
import { GtagEvent } from 'src/app/models/gtag-event';
import { SharedService } from 'src/app/services/shared.service';
import { ResponseObject } from 'src/app/models/response-object';
import { ResponseArray } from 'src/app/models/response-array';
import { DeckInfo } from 'src/app/models/deck-info';

@Component({
  selector: 'app-play-deck',
  templateUrl: './play-deck.component.html',
  styleUrls: ['./play-deck.component.css']
})
export class PlayDeckComponent implements OnInit {

  id: number | undefined;
  cards: CardPlay[] = [];
  card: CardPlay | undefined;
  answers: any[] = [];
  index: number = 0;
  score: number = 0;
  progressPercentage: string = "0%";
  playgame: boolean = true;

  today: string = moment().format();

  TIME_FOR_QUESTION: number = 9;
  timeLeft: number | undefined;
  interval: any;

  showAnswer: boolean = false;
  answer: string = "";

  restTime: number = 0;

  constructor(
    private flipmeService: FlipmeService,
    private sharedService: SharedService,
    public route: ActivatedRoute,
    private spinner: NgxSpinnerService,
    private app: AppComponent) {

    route.params.subscribe(params => {
      this.id = params['id'];
    });
  }

  ngOnInit(): void {
    this.setVisitPage();
    this.getPreviewCards();
  }

  private setVisitPage(): void {
    const gtagEvent: GtagEvent = {
      name_event: 'play_deck',
      params: {
        event_category: 'Play',
        action: 'Play',
        event_label: `/play/${this.id}`
      }
    }

    this.app.setEventAnalytics(gtagEvent);
  }

  private createStat(): void {

    const stats: Stats = {
      id_deck: +this.id!,
      id_user: this.sharedService.getIdUser(),
      time: (this.restTime || 0),
      score: this.score,
      created_at: this.today
    };

    this.flipmeService.createStat(stats)
      .subscribe(response => {
        this.spinner.hide();
      }, err => {
        this.spinner.hide();
      });

  }

  private getPreviewCards(): void {

    this.spinner.show();

    this.flipmeService.getPreviewCards(this.id!)
      .subscribe((result: ResponseObject) => {

        if (result.success) {

          const preview: DeckInfo = result.response

          this.TIME_FOR_QUESTION = preview.deck.timer;
          this.timeLeft = preview.deck.timer;

          this.getPlayDeck();
          this.startTimerQuestion();
        } else {
          this.spinner.hide()
        }
      }, err => {
        this.spinner.hide();
      });
  }

  private getPlayDeck(): void {
    this.flipmeService.getPlayDeck(this.id!)
      .subscribe((result: ResponseArray) => {

        if (result.success) {
          this.cards = this.shuffleCards(result.response);
          this.card = this.cards[this.index];
          this.answers = JSON.parse(this.card.answer!);
          this.progressBarAdvance();

          this.spinner.hide();
        } else {
          this.spinner.hide();
        }
      }, err => {
        this.spinner.hide();
      });
  }

  private shuffleCards(array: any): any {

    var currentIndex = array.length, randomIndex;

    // While there remain elements to shuffle...
    while (0 !== currentIndex) {

      // Pick a remaining element...
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;

      // And swap it with the current element.
      [array[currentIndex], array[randomIndex]] = [
        array[randomIndex], array[currentIndex]];
    }

    return array;
  }

  nextQuestion = (): void => {
    this.index += 1;

    if (this.index <= (this.cards.length - 1)) {
      this.showAnswer = false;
      this.answer = "";
      this.card = this.cards[this.index];
      this.answers = JSON.parse(this.card.answer!);
      this.progressBarAdvance();
      this.timeLeft = this.TIME_FOR_QUESTION;
      this.startTimerQuestion();
    } else {
      this.playgame = false;
    }
  }

  progressBarAdvance(): void {

    const total = (100 / this.cards.length);
    const calcPercent = (this.index + 1) * total;

    if (calcPercent <= 100) {
      this.progressPercentage = calcPercent + "%";
    }
  }

  checkAnswer = (isTrue: boolean): void => {
    this.stopTimer();
    this.showAnswer = true;
    this.answer = (isTrue) ? "Correcto" : "Incorrecto"
    this.score += (isTrue) ? 1 : 0;

    if (this.cards.length === (this.index + 1)) {
      this.spinner.show();
      this.createStat();
    }
  }

  resetGame(): void {
    this.stopTimer();
    this.showAnswer = false;
    this.answer = "";
    this.getPlayDeck();
    this.index = 0;
    this.score = 0;
    this.playgame = true;
    this.timeLeft = this.TIME_FOR_QUESTION;
    this.restTime = 0;
    this.startTimerQuestion();
  }

  startTimerQuestion(): void {
    this.interval = setInterval(() => {
      if (this.timeLeft! > 0) {
        this.timeLeft!--;
      } else {
        this.checkAnswer(false);
      }
    }, 1000);
  }

  stopTimer(): void {
    this.restTime += (this.TIME_FOR_QUESTION - this.timeLeft!);
    this.timeLeft = 0;
    window.clearTimeout(this.interval);
  }

}
