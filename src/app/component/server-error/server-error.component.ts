import { Component } from '@angular/core';
import {Router} from "@angular/router";

@Component({
  selector: 'app-server-error',
  templateUrl: './server-error.component.html',
  styleUrls: ['./server-error.component.css']
})
export class ServerErrorComponent {
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
