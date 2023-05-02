import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";

@Injectable()
export class NotificationService {

  constructor(private http: HttpClient) {
  }

  setViewed(notificationIds: string[]) {
    return this.http.post('http://localhost:8081/notification/setViewed', notificationIds)
  }
  getNotificationsForUser() {
    return this.http.get('http://localhost:8081/notification/forUser')
  }
}
