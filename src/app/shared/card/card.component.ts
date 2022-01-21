import { Component, Input, OnInit } from '@angular/core';
import { CardPlay } from 'src/app/models/card-play';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.css']
})
export class CardComponent implements OnInit {

  @Input() questionCard: CardPlay | undefined;
  @Input() answers: any;
  @Input() checkAnswer: any;
  @Input() showAnswer: boolean = false;
  @Input() answer: string | undefined;
  @Input() nextQuestion: any;

  correct: string | undefined;
  incorrect: string | undefined;

  constructor() { }

  ngOnInit(): void { }

  answerIsTrue(isTrue: boolean, index: number): void {

    if (isTrue) {
      this.correct = this.answers[index].answer;
    } else {
      const tempAnswer = this.answers.find((answer: any) => answer.is_true === true);
      this.correct = tempAnswer.answer;
      this.incorrect = this.answers[index].answer;
    }

    this.checkAnswer(isTrue);
  }

}
