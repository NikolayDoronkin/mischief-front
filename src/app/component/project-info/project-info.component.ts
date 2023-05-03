import {Component, OnInit} from '@angular/core';
import {ProjectService} from "../../service/project.service";
import {ActivatedRoute, Router} from "@angular/router";
import {Project} from "../../model/project/project";
import {StoreService} from "../../service/store.service";
import {UserResponse} from "../../model/user/user.response";
import {ProjectDashboard} from "../../model/project/project.dashboard";
import {ProjectStatistics} from "../../model/project/project.statistics";
import {DialogContentExampleDialog} from "../team/team.component";
import {MatDialog} from "@angular/material/dialog";

@Component({
  selector: 'app-project-info',
  templateUrl: './project-info.component.html',
  styleUrls: ['./project-info.component.css'],
  providers: [ProjectService]
})
export class ProjectInfoComponent implements OnInit {

  isAdmin: boolean = false
  projectStatistics: ProjectStatistics[] = []

  dashboard: ProjectDashboard = new ProjectDashboard(
    0, 0, 0, 0, [])

  project: Project = new Project("", "", "", "", "",
    new UserResponse("", "", "", "", []),
    new Date(), [], [])

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private projectService: ProjectService,
    private storeService: StoreService,
    private dialog: MatDialog
  ) {
  }

  openUserProfilePopUp(userId: string) {
    const dialogRef =
      this.dialog.open(DialogContentExampleDialog, {
        data: {
          id: userId
        }
      });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }

  goTaskInfo(projectId: string, taskId: string) {
    this.router.navigate(['task-info'], {
      queryParams: {
        "taskId": taskId,
        "projectId": projectId
      }
    })
  }

  ngOnInit(): void {
    this.activatedRoute.queryParams
      .subscribe(params => {
        const projectId = params['projectId']

        this.projectService.getProjectById(projectId)
          .subscribe({
              next: (data: any) => {
                this.project.id = data['id']
                this.project.name = data['name']
                this.project.shortName = data['shortName']
                this.project.description = data['description']
                this.project.creatorId = data['creatorId']
                this.project.created = data['created']

                this.storeService.currentProject = data

                this.isAdmin = this.storeService.currentUser.id == this.project.creatorId;

                if(this.isAdmin) {
                  this.projectService.getStatistics(projectId).subscribe(
                    {
                      next: (data: any) => {
                        console.log(data)
                        this.projectStatistics = data
                      },
                      error: (error: any) => this.handleError(error)
                    }
                  )
                }
              },
              error: (error: any) => {
                this.handleError(error)
              }
            }
          )

        this.projectService.getProjectDashboard(projectId)
          .subscribe({
            next: (data: any) => {
              this.dashboard.totalTicketsFromProject = data['totalTicketsFromProject']
              this.dashboard.done = data['done']
              this.dashboard.inProgress = data['inProgress']
              this.dashboard.onReview = data['onReview']
              this.dashboard.lastUpdatedTickets = data['lastUpdatedTickets']
            },
            error: (error: any) => {
              this.handleError(error)
            }
          })
      })
  }

  private handleError(error: any) {
    console.log(error)
    if (error['status'] == 403) {
      this.router.navigate(['login'])
    } else if (error['status'] == 401) {
      this.router.navigate(['401'])
    } else if (error['status'] >= 500) {
      this.router.navigate(['500'])
    }
  }
}
