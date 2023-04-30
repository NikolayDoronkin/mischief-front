import {Component, Input, OnInit} from '@angular/core';
import {routingAnimation} from "../../shared/routing-animation";
import {UserResponse} from "../../model/user/user.response";
import {UserService} from "../../service/user.service";

@Component({
  animations: [routingAnimation],
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
  providers: [UserService]
})
export class DashboardComponent implements OnInit {

  @Input()
  public userResponse: UserResponse = new UserResponse('', '', '', '', [])

  constructor(private service: UserService) {
  }
  ngOnInit(): void {
    this.service.getCurrentUser()
      .subscribe({
        next: (data: any) => {
          console.log(data)
          this.userResponse.id = data['id']
          this.userResponse.firstName = data['firstName']
          this.userResponse.lastName = data['lastName']
          this.userResponse.login = data['login']
        },
        error: err => console.log(err)
      })
  }
}
