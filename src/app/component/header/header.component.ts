import {Component, OnDestroy, OnInit} from '@angular/core';
import {UserResponse} from "../../model/user/user.response";
import {StoreService} from "../../service/store.service";
import {UserService} from "../../service/user.service";
import {map, Subscription, timer} from "rxjs";
import {NotificationService} from "../../service/notification.service";
import {Notification} from "../../model/notification/notification";
import {Router} from "@angular/router";
import {TranslocoService} from "@ngneat/transloco";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
  providers: [UserService, NotificationService]
})
export class HeaderComponent implements OnInit, OnDestroy {

  siteLanguage: string | undefined = 'English';
  languageList: {code: string; label: string}[] = [
    { code: 'en', label: 'English' },
    { code: 'ru', label: 'Russian' },
  ];

  activeNotifications: Notification[] = []

  timerSubscription: Subscription;
  currentUser: UserResponse = new UserResponse("", "", "", "", "", "", "", "", "", "", [])

  constructor(
    private service: UserService,
    private storeService: StoreService,
    private notificationService: NotificationService,
    private router: Router,
    private translocoService: TranslocoService
  ) {
  }

  changeSiteLanguage(language: string): void {
    this.translocoService.setActiveLang(language);
    this.siteLanguage = this.languageList.find(lang => lang.code === language)?.label;
  }

  openRelatedTicket(projectId: string, taskId: string) {
    const notificationIds: string[] = this.activeNotifications
      .map(notification => notification.id)

    this.notificationService.setViewed(notificationIds)
      .subscribe({
        next: (data: any) => {
        },
        error: (error: any) => console.log(error)
      })
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

  goLogout(){
    localStorage.removeItem('access_token')
    this.router.navigate(['login'])
  }

  goProfile() {
    this.router.navigate(['profile'])
  }
}

