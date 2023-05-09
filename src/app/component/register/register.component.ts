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
    "", "","",
    "","","",
    "","","","","",
  )

  constructor(private loginService: UserService, private router: Router) {
  }

  goLogin() {
    this.router.navigate(['/login'])
  }

  signIn(user: SignInUser) {
    localStorage.setItem('access_token', '')
    if (user.image == null || user.image == '') {
      user.image = 'https://e7.pngegg.com/pngimages/59/659/png-clipart-computer-icons-scalable-graphics-avatar-emoticon-animal-fox-jungle-safari-zoo-icon-animals-orange-thumbnail.png'
    }
    this.loginService.signIn(user)

  }

}
