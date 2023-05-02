import { Component } from '@angular/core';
import {Router} from "@angular/router";

@Component({
  selector: 'app-unauthorized',
  templateUrl: './unauthorized.component.html',
  styleUrls: ['./unauthorized.component.css']
})
export class UnauthorizedComponent {
  action: string = ''

  constructor(private router: Router) {
  }

  ngOnInit(): void {
    console.log(localStorage.getItem('access_token'))
    this.action = localStorage.getItem('access_token') != null ? '/dashboard' : '/login'
  }

  goTo() {
    this.router.navigate([this.action])
  }
}
