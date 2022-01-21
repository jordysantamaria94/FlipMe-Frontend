import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import { AppRoutingModule } from './app-routing.module';
import { routes } from './app-routing.module';

import { AppComponent } from './app.component';
import { MainComponent } from './components/main/main.component';
import { NavbarComponent } from './shared/navbar/navbar.component';
import { FooterComponent } from './shared/footer/footer.component';
import { DeckComponent } from './shared/deck/deck.component';
import { CardComponent } from './shared/card/card.component';
import { HttpClientModule } from '@angular/common/http';
import { DeckInfoComponent } from './components/deck-info/deck-info.component';
import { CardPreviewComponent } from './shared/card-preview/card-preview.component';
import { PlayDeckComponent } from './components/play-deck/play-deck.component';
import { LoginComponent } from './components/login/login.component';
import { SignupComponent } from './components/signup/signup.component';

import { SocialLoginModule, SocialAuthServiceConfig } from 'angularx-social-login';
import {
  GoogleLoginProvider,
  FacebookLoginProvider
} from 'angularx-social-login';
import { DashboardComponent } from './components/user/dashboard/dashboard.component';
import { AuthGuardService as AuthGuard } from './auth/auth-guard.service';
import { JwtModule } from '@auth0/angular-jwt';
import { AddDeckComponent } from './components/user/decks/add-deck/add-deck.component';
import { UpdateDeckComponent } from './components/user/decks/update-deck/update-deck.component';
import { GeneralCardsComponent } from './components/user/cards/general-cards/general-cards.component';
import { AddCardComponent } from './components/user/cards/add-card/add-card.component';
import { UpdateCardComponent } from './components/user/cards/update-card/update-card.component';
import { NgxSpinnerModule } from 'ngx-spinner';
import { NgxImageCompressService } from 'ngx-image-compress';
import { StatsDeckComponent } from './components/user/decks/stats-deck/stats-deck.component';
import { PrivacyPolicyComponent } from './components/terms/privacy-policy/privacy-policy.component';
import { TermsUseComponent } from './components/terms/terms-use/terms-use.component';
import { SigninModalComponent } from './shared/modals/signin-modal/signin-modal.component';
import { SignupModalComponent } from './shared/modals/signup-modal/signup-modal.component';
import { ForgotPasswordComponent } from './components/forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './components/reset-password/reset-password.component';
import { HeaderComponent } from './shared/header/header.component';
import { MetasComponent } from './shared/metas/metas.component';
import { PaginationComponent } from './shared/pagination/pagination.component';
import { SearchComponent } from './components/search/search.component';
import { ConfigurationComponent } from './components/user/configuration/configuration.component';

@NgModule({
  declarations: [
    AppComponent,
    MainComponent,
    NavbarComponent,
    FooterComponent,
    DeckComponent,
    CardComponent,
    DeckInfoComponent,
    CardPreviewComponent,
    PlayDeckComponent,
    LoginComponent,
    SignupComponent,
    DashboardComponent,
    AddDeckComponent,
    UpdateDeckComponent,
    GeneralCardsComponent,
    AddCardComponent,
    UpdateCardComponent,
    StatsDeckComponent,
    PrivacyPolicyComponent,
    TermsUseComponent,
    SigninModalComponent,
    SignupModalComponent,
    ForgotPasswordComponent,
    ResetPasswordComponent,
    HeaderComponent,
    MetasComponent,
    PaginationComponent,
    SearchComponent,
    ConfigurationComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    HttpClientModule,
    AppRoutingModule,
    SocialLoginModule,
    NgxSpinnerModule,
    ReactiveFormsModule,
    JwtModule.forRoot({
      config: {
        tokenGetter: function tokenGetter() {
          return localStorage.getItem('token');
        }
      }
    }),
    RouterModule.forRoot(routes, { useHash: true }),
  ],
  providers: [
    {
      provide: 'SocialAuthServiceConfig',
      useValue: {
        autoLogin: false,
        providers: [
          {
            id: GoogleLoginProvider.PROVIDER_ID,
            provider: new GoogleLoginProvider('905035223619-flhgcrs8lrauojqfutdrufov1ivet007.apps.googleusercontent.com')
          },
          {
            id: FacebookLoginProvider.PROVIDER_ID,
            provider: new FacebookLoginProvider('2703504229946900')
          }
        ]
      } as SocialAuthServiceConfig,
    },
    NgxImageCompressService,
    NavbarComponent
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
