import { Component, Input, OnInit } from '@angular/core'
import { ResponsePagination } from 'src/app/models/response-pagination'

@Component({
  selector: 'app-pagination',
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.css']
})
export class PaginationComponent implements OnInit {

  @Input() getData: any
  @Input() dataPagination?: ResponsePagination

  constructor() { }

  ngOnInit(): void {
  }

  nextPage(): void {
    const page = this.dataPagination?.current_page! + 1
    this.getData(page)
  }

  lastPage(): void {
    const page = this.dataPagination?.current_page! - 1
    this.getData(page)
  }

}
