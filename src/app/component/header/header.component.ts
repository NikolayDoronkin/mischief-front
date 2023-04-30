import {Component, OnInit} from '@angular/core';
import {UserResponse} from "../../model/user/user.response";
import {StoreService} from "../../service/store.service";
import {UserService} from "../../service/user.service";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
  providers: [UserService]
})
export class HeaderComponent implements OnInit{

  currentUser: UserResponse = new UserResponse("", "", "", "", [])

  constructor(
    private storeService: StoreService,
    private service: UserService,
  ) {
  }
  ngOnInit(): void {
    this.service.getCurrentUser()
      .subscribe({
        next: (data: any) => {

          this.currentUser.id = data['id']
          this.currentUser.firstName = data['firstName']
          this.currentUser.lastName = data['lastName']
          this.currentUser.login = data['login']
          this.currentUser.creatorProjects = data['creatorProjects']

          this.storeService.currentUser = this.currentUser
        },
        error: err => console.log(err)
      })
  }

}
