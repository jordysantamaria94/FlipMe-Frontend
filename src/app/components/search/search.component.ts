import { Component, OnInit } from '@angular/core'
import { ActivatedRoute } from '@angular/router'
import { NgxSpinnerService } from 'ngx-spinner'
import { Decks } from 'src/app/models/decks'
import { ResponseArray } from 'src/app/models/response-array'
import { FlipmeService } from 'src/app/services/flipme.service'

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {

  search: string | undefined
  decks: Decks[] = []

  constructor(private route: ActivatedRoute, 
    private flipmeService: FlipmeService,
    private spinner: NgxSpinnerService) { 

    this.route.params.subscribe(param => {
      this.spinner.show()
      this.searchDeck(param.search)
    })
  }

  ngOnInit(): void {
  }

  searchDeck(search: string): void {

    this.search = search

    this.flipmeService.searchDeck(search)
      .subscribe((result: ResponseArray) => {

        if (result.success) {
          this.decks = [...result.response!]
          this.spinner.hide()
        } else {
          this.spinner.hide()
        }

      }, () => {
        this.spinner.hide()
      });
  }

}
