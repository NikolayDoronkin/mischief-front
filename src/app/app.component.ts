import { Component } from '@angular/core';
import {Router} from "@angular/router";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'diplomfront';
  loginUrls = ['/login', '/signIn']

  constructor(private router: Router) {
  }

  checkIfLoginPage() {
    return !this.loginUrls.includes(this.router.url)
  }
}
