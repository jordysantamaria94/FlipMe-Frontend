import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { SocialAuthService } from 'angularx-social-login';
import decode from 'jwt-decode';
import { AppComponent } from 'src/app/app.component';
import { GtagEvent } from 'src/app/models/gtag-event';
import { FlipmeService } from 'src/app/services/flipme.service';
import { SharedService } from 'src/app/services/shared.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  logged: boolean = false;
  name: string | undefined;

  constructor(
    private authService: SocialAuthService,
    private shared: SharedService,
    private route: Router,
    private app: AppComponent) {
      this.showNav();
    }

  ngOnInit(): void {}

  showNav(): void {
    this.shared.loggedStream$.subscribe(data => {

      this.logged = data;

      if (data) {
        this.name = this.shared.getNameUser();
      }
    });

    if (!this.logged) {
      this.shared.broadcastLoggedStream((localStorage.getItem("token") ? true : false ));
    }
  }

  signOut(): void {

    const gtagEvent: GtagEvent = {
      name_event: 'user_signout',
      params: {
        event_category: 'Signout',
        action: 'Cerrar Sesión',
        event_label: 'redirect to Login'
      }
    }

    this.app.setEventAnalytics(gtagEvent);

    this.authService.signOut();
    this.logged = false;
    this.name = "";
    localStorage.clear();
    this.shared.broadcastLoggedStream(false);
    this.route.navigate(['/signin']);
  }

  search(sendForm: NgForm): void {

    if (sendForm.value.search !== "") {
      this.route.navigate(['/search', sendForm.value.search]);
    }
  }

}
