import {Component, HostBinding} from '@angular/core';
import {UserService} from "../../service/user.service";
import {SignInUser} from "../../model/user/signin.user";
import {Router} from "@angular/router";
import {routingAnimation} from "../../shared/routing-animation";

@Component({
  animations: [routingAnimation],
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
  providers: [UserService]
})
export class RegisterComponent {

  @HostBinding('@routingAnimation')
  private routing: any;

  user: SignInUser = new SignInUser(
    "Nikolay", "Doronkin Mejia", "testAngularSignIn",
    "barbecue", "barbecue");

  constructor(private loginService: UserService, private router: Router) {
  }

  goLogin() {
    this.router.navigate(['/login'])
  }

  signIn(user: SignInUser) {
    console.log(user)
    this.loginService.signIn(user)
  }

}
