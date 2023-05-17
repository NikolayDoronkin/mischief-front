import {Component, OnInit} from '@angular/core';
import {Router} from "@angular/router";

@Component({
  selector: 'app-not-found',
  templateUrl: './not-found.component.html',
  styleUrls: ['./not-found.component.css']
})
export class NotFoundComponent implements OnInit {

  action: string = ''

  constructor(private router: Router) {
  }

  ngOnInit(): void {
    this.action = localStorage.getItem('access_token') != null ? '/dashboard' : '/login'
  }

  goTo() {
    this.router.navigate([this.action])
  }

}
