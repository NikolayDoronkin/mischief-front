import {Component, OnInit, Renderer2} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {animate, state, style, transition, trigger} from "@angular/animations";

declare let gapi: any;
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
  ]
})
export class MenuComponent implements OnInit{

  projectMenu = ['/project-info', '/task', '/team', '/task-creation']
  state: string = 'initial'

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {
  }

  ngOnInit(): void {
    this.loadScripts()
  }

  loadScripts() {
    const dynamicScripts = [
      '../assets/js/theme.js',
      '../assets/js/bs-init.js',
      '../assets/js/chart.min.js',
      '../assets/bootstrap/js/bootstrap.min.js'
    ];
    for (let i = 0; i < dynamicScripts.length; i++) {
      const node = document.createElement('script');
      node.src = dynamicScripts[i];
      node.type = 'text/javascript';
      node.async = false;
      node.charset = 'utf-8';
      document.getElementsByTagName('head')[0].appendChild(node);
    }
  }

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
    localStorage.removeItem('access_token')
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
        }).then(() => window.location.reload())
      })

  }

  goTeam() {
    this.activatedRoute.queryParams
      .subscribe(params => {
        console.log(params['projectId'])
        const projectId = params['projectId']
        this.router.navigate(['team'], {
          queryParams:{
            "projectId": projectId
          }
        })
      })
  }
}
