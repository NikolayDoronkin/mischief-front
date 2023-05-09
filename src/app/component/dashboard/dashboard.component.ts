import {Component, Input, OnInit} from '@angular/core';
import {routingAnimation} from "../../shared/routing-animation";
import {UserResponse} from "../../model/user/user.response";
import {UserService} from "../../service/user.service";
import {Router} from "@angular/router";
import {ProjectService} from "../../service/project.service";
import {Dashboard} from "../../model/project/dashboard";

@Component({
  animations: [routingAnimation],
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
  providers: [UserService, ProjectService]
})
export class DashboardComponent implements OnInit {

  @Input()
  public userResponse: UserResponse = new UserResponse('', '', '', '',
    "", "", "", "", "", "", [])
  dashboard: Dashboard = new Dashboard(0, 0, 0, 0, [], [])

  constructor(
    private router: Router,
    private service: UserService,
    private projectService: ProjectService,
  ) {
  }

  goProjectInfo(projectId: string) {
    this.router.navigate(['project-info'],
      {
        queryParams: {
          projectId: projectId
        }
      })
  }

  goTaskInfo(projectId: string, taskId: string) {
    console.log('here!')
    this.router.navigate(['task-info'], {
      queryParams: {
        "taskId": taskId,
        "projectId": projectId
      }
    })
  }

  ngOnInit(): void {
    this.service.getCurrentUser()
      .subscribe({
        next: (data: any) => {
          this.userResponse.id = data['id']
          this.userResponse.firstName = data['firstName']
          this.userResponse.lastName = data['lastName']
          this.userResponse.login = data['login']
        },
        error: (error: any) => {
          this.handleError(error)
        }
      })

    this.projectService.getDashboard().subscribe({
      next: (data: any) => {
        this.dashboard.totalProjects = data['totalProjects']
        this.dashboard.totalTicketsFromProjects = data['totalTicketsFromProjects']
        this.dashboard.totalTicketsFromProjectsInProgress = data['totalTicketsFromProjectsInProgress']
        this.dashboard.totalTicketsFromProjectsInDone = data['totalTicketsFromProjectsInDone']
        this.dashboard.lastModifiedProjects = data['lastModifiedProjects']
        this.dashboard.lastModifiedTickets = data['lastModifiedTickets']
      },
      error: (error: any) => {
        this.handleError(error)
      }
    })
  }

  private handleError(error: any) {
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
}
