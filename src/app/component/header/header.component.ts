import {Component, OnDestroy, OnInit} from '@angular/core';
import {UserResponse} from "../../model/user/user.response";
import {StoreService} from "../../service/store.service";
import {UserService} from "../../service/user.service";
import {map, Subscription, timer} from "rxjs";
import {NotificationService} from "../../service/notification.service";
import {Notification} from "../../model/notification/notification";
import {Router} from "@angular/router";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
  providers: [UserService, NotificationService]
})
export class HeaderComponent implements OnInit, OnDestroy {

  activeNotifications: Notification[] = []

  timerSubscription: Subscription;
  currentUser: UserResponse = new UserResponse("", "", "", "", "", "", "", "", "", "", [])

  constructor(
    private service: UserService,
    private storeService: StoreService,
    private notificationService: NotificationService,
    private router: Router,
  ) {
  }

  checkActivatedNotificationLength() {
    return this.activeNotifications.length > 0
  }
  handleActiveNotifications() {
    const notificationIds: string[] = this.activeNotifications
      .map(notification => notification.id);

    this.notificationService.setViewed(notificationIds)
      .subscribe({
        next: (data: any) => {
          this.activeNotifications = []
        },
        error: (error: any) => console.log(error)
      })
  }
  openRelatedTicket(projectId: string, taskId: string) {
    this.router.navigate(['task-info'], {
      queryParams: {
        "taskId": taskId,
        "projectId": projectId
      }
    })
  }

  loadNotificationsForUser() {
    this.notificationService.getNotificationsForUser()
      .subscribe({
        next: (data: any) => {
          console.log(data)
          this.activeNotifications = data
        },
        error: (error: any) => console.log(error)
      })
  }

  ngOnInit(): void {
    this.service.getCurrentUser()
      .subscribe({
        next: (data: any) => {

          this.currentUser.id = data['id']
          this.currentUser.firstName = data['firstName']
          this.currentUser.lastName = data['lastName']
          this.currentUser.login = data['login']
          this.currentUser.email = data['email']
          this.currentUser.image = data['image']
          this.currentUser.address = data['address']
          this.currentUser.city = data['city']
          this.currentUser.country = data['country']
          this.currentUser.creatorProjects = data['creatorProjects']

          this.storeService.currentUser = this.currentUser
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

    this.timerSubscription = timer(0, 2000).pipe(
      map(() => {
        this.loadNotificationsForUser(); // load data contains the http request
      })
    ).subscribe();
  }

  ngOnDestroy(): void {
    this.timerSubscription.unsubscribe();
  }
}

