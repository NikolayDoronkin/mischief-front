import {Component, OnInit} from '@angular/core';
import {routingAnimation} from "../../shared/routing-animation";
import {UserService} from "../../service/user.service";
import {UserResponse} from "../../model/user/user.response";
import {StoreService} from "../../service/store.service";
import {UpdateUser} from "../../model/user/update.user";

@Component({
  animations: [routingAnimation],
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
  providers: [UserService]
})
export class ProfileComponent implements OnInit {

  userResponse: UserResponse = new UserResponse("", "", "", "", [])

  constructor(
    private service: UserService,
    private storeService: StoreService,
    ) {
  }

  updateUser() {
    console.log(this.userResponse)
    this.service.updateUser(new UpdateUser(this.userResponse.id, this.userResponse.login))
      .subscribe({
        next: (data: any) => {

          this.userResponse.id = data['id']
          this.userResponse.firstName = data['firstName']
          this.userResponse.lastName = data['lastName']
          this.userResponse.login = data['login']
          this.userResponse.creatorProjects = data['creatorProjects']

          this.storeService.currentUser = this.userResponse
        },
        error: err => console.log(err)
      })
  }

  ngOnInit(): void {
    if (this.storeService.currentUser.isEmpty()) {
      this.service.getCurrentUser()
        .subscribe({
          next: (data: any) => {

            this.userResponse.id = data['id']
            this.userResponse.firstName = data['firstName']
            this.userResponse.lastName = data['lastName']
            this.userResponse.login = data['login']
            this.userResponse.creatorProjects = data['creatorProjects']

            this.storeService.currentUser = this.userResponse
          },
          error: err => console.log(err)
        })
    } else {
      this.userResponse = this.storeService.currentUser
    }
  }
}
