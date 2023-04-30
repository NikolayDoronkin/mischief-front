import {Component} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {animate, state, style, transition, trigger} from "@angular/animations";

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css'],
  animations: [
    trigger('expandedPanel', [
      state('initial', style({ height: 0 })),
      state('expanded', style({ height: '*' })),
      transition('* <=> *', animate('0s')),
    ]),
  ],
})
export class MenuComponent {

  projectMenu = ['/project-info', '/task', '/team', '/task-creation']
  state: string = 'initial'

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
  ) {}

  checkProjectInfoPage(): boolean {
    const isTrue: boolean = this.projectMenu.some(url => this.router.url.match(url));
    this.state = isTrue ? 'expanded' : 'initial'
    return isTrue
  }

  goDashboard(){
    this.router.navigate(['dashboard'])
  }
  goProfile() {
    this.router.navigate(['profile'])
  }

  goProjects(){
    this.router.navigate(['project'])
  }

  goProjectInfo(){
    this.activatedRoute.queryParams
      .subscribe(params => {
        const projectId = params['projectId']

        this.router.navigate(['project-info'], {
          queryParams:{
            "projectId": projectId
          }
        })
      })
  }

  goLogout(){
    this.router.navigate(['login'])
  }

  goTask() {
    this.activatedRoute.queryParams
      .subscribe(params => {
        const projectId = params['projectId']

        this.router.navigate(['task'], {
          queryParams:{
            "projectId": projectId
          }
        })
      })

  }

  goTeam() {
    this.router.navigate(['team'])
  }
}
