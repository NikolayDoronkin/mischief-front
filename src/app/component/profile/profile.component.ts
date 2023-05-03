import {Component, Input, OnInit} from '@angular/core';
import {routingAnimation} from "../../shared/routing-animation";
import {UserService} from "../../service/user.service";
import {UserResponse} from "../../model/user/user.response";
import {StoreService} from "../../service/store.service";
import {UpdateUser} from "../../model/user/update.user";
import {Router} from "@angular/router";

@Component({
  animations: [routingAnimation],
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
  providers: [UserService]
})
export class ProfileComponent implements OnInit {

  @Input()
  idFromTeamComponent: string = ''
  filtersLoaded1: Promise<boolean>;

  editable: boolean = true

  userResponse: UserResponse = new UserResponse("", "", "", "", [])

  constructor(
    private service: UserService,
    private router: Router,
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
        }
      })
  }

  ngOnInit(): void {
      if (this.idFromTeamComponent == '') {
        this.service.getCurrentUser()
          .subscribe({
            next: (data: any) => {

              this.userResponse.id = data['id']
              this.userResponse.firstName = data['firstName']
              this.userResponse.lastName = data['lastName']
              this.userResponse.login = data['login']
              this.userResponse.creatorProjects = data['creatorProjects']

              this.storeService.currentUser = this.userResponse
              this.filtersLoaded1 = Promise.resolve(true)
              this.editable = true
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
            }
          })
      } else {
        this.service.getUserById(this.idFromTeamComponent)
          .subscribe({
            next: (data: any) => {
              this.userResponse.id = data['id']
              this.userResponse.firstName = data['firstName']
              this.userResponse.lastName = data['lastName']
              this.userResponse.login = data['login']
              this.userResponse.creatorProjects = data['creatorProjects']
              this.filtersLoaded1 = Promise.resolve(true)
              this.editable = false
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
            }
          })
      }
  }
}
