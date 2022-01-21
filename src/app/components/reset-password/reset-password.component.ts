import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { FlipmeService } from 'src/app/services/flipme.service';
import decode from 'jwt-decode';
import * as moment from 'moment';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent implements OnInit {

  today: string = moment().format();
  token: string | undefined;

  constructor(
    private spinner: NgxSpinnerService, 
    private flipMeService: FlipmeService,
    private router: Router,
    private route: ActivatedRoute) {

      this.route.queryParams.subscribe(param => {
        if (param.code) {
          this.token = param.code;
        } else {
          this.router.navigate(['signin']);
        }
      });
    }

  ngOnInit(): void {
  }

  updatePassword(sendForm: NgForm): void {

    this.spinner.show();

    if (sendForm.value.new === sendForm.value.repeat) {

      const form = {
        token: this.token,
        password: sendForm.value.new
      }

      this.flipMeService.updatePasswordForgot(form)
        .subscribe(response => {
          this.spinner.hide();
          console.log(response);
          this.router.navigate(['signin']);
        });
    } else {
      this.spinner.hide();
    }
  }

}
