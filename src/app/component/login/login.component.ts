import {Component, HostBinding, OnInit} from '@angular/core';
import {UserService} from "../../service/user.service";
import {LoginUser} from "../../model/user/login.user";
import {Router} from "@angular/router";
import {routingAnimation} from "../../shared/routing-animation";

@Component({
  animations: [routingAnimation],
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  providers: [UserService]
})
export class LoginComponent implements OnInit {

  @HostBinding('@routingAnimation')
  private routing: any;

  user: LoginUser = new LoginUser("serious1sam", "test");
  count: number = 0;

  constructor(private configService: UserService, private router: Router) {
  }
  public logIn(user: LoginUser) {
    localStorage.setItem('access_token', '')
    this.configService.logIn(user)
      .subscribe({
        next: (data: any) => {
          console.log(data)
          localStorage.setItem('access_token', data['accessToken'])
          // console.log(localStorage.getItem('access_token'))
          this.router.navigate(['dashboard'])
        },
        error: err => console.log(err)
      });
  }

  public goRegister() {
    this.router.navigate(['signIn'])
  }

  ngOnInit(): void {
  }
}