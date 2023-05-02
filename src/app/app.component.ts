import {Component} from '@angular/core';
import {Router} from "@angular/router";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'diplomfront';
  availableUrls = [
    '/dashboard',
    '/profile',
    '/project',
    '/project-info',
    '/project-creation',
    '/task-creation',
    '/task-info',
    '/team',
    '/task'
  ]

  loginUrls = [
    '/login',
    '/signIn',
  ]

  constructor(private router: Router) {
  }

  checkIfLoginPage() {
    const currentRoute =
      this.router.url.indexOf('?') == -1
        ? this.router.url
        : this.router.url.substring(0, this.router.url.indexOf('?'))

    console.log(currentRoute)
    return this.availableUrls.includes(currentRoute) &&
      !this.loginUrls.includes(currentRoute)
  }
}
