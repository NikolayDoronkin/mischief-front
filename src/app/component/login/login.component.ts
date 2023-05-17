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

  errorMessage: string = ''

  user: LoginUser = new LoginUser("serious1sam", "test");
  count: number = 0;

  constructor(private configService: UserService, private router: Router) {
  }
  public logIn(user: LoginUser) {
    localStorage.setItem('access_token', '')
    this.configService.logIn(user)
      .subscribe({
        next: (data: any) => {
          localStorage.setItem('access_token', data['accessToken'])
          // console.log(localStorage.getItem('access_token'))
          this.router.navigate(['dashboard'])
        },
        error: (error: any) => {
          console.log(error)
          if (error['status'] == 403) {
            this.router.navigate(['login'])
          }
          else if (error['status'] == 401) {
            this.router.navigate(['401'])
          }
          else if (error['status'] >= 500) {
            this.router.navigate(['500'])
          }
          else if (error['status'] == 404 || error['status'] == 400) {
            this.errorMessage = error['error']
            if (this.errorMessage.indexOf(':') != -1) {
              this.errorMessage = this.errorMessage.substring(0, this.errorMessage.indexOf(':'))
            }
            else if (this.errorMessage.indexOf('.') != -1) {
              this.errorMessage = this.errorMessage.substring(0, this.errorMessage.indexOf('.'))
            }
          }
        }
      });
  }

  public goRegister() {
    this.router.navigate(['signIn'])
  }

  ngOnInit(): void {
  }
}
