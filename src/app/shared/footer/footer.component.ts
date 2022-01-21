import { Component, OnInit } from '@angular/core'

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {

  cookies: boolean = true

  constructor() { }

  ngOnInit(): void {
    if (localStorage.getItem("_c_fm")) {
      this.cookies = false
    } else {
      localStorage.setItem("_c_fm", "true")
    }
  }

  closeCookies(): void {
    this.cookies = false
  }

}
