import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {TaskService} from "../../service/task.service";
import {TaskResponse} from "../../model/task/task.response";
import {ProjectService} from "../../service/project.service";
import {Project} from "../../model/project/project";
import {StoreService} from "../../service/store.service";
import {UserResponse} from "../../model/user/user.response";

@Component({
  selector: 'app-task',
  templateUrl: './task.component.html',
  styleUrls: ['./task.component.css'],
  providers: [TaskService, ProjectService, StoreService],
})
export class TaskComponent implements OnInit {

  tasks: TaskResponse[] = []

  project: Project = new Project("", "", "", "", "",
    new UserResponse("", "", "", "", "", "",
      "", "", "", "", []),
    new Date(), [], [])

  constructor(
    private router: Router,
    private activeRoute: ActivatedRoute,
    private taskService: TaskService,
    private projectService: ProjectService,
    private storeService: StoreService,
  ) {
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

  goTaskCreation() {
    this.activeRoute.queryParams
      .subscribe(params => {
        const projectId = params['projectId']

        this.router.navigate(['task-creation'], {
          queryParams: {
            "projectId": projectId
          }
        })
      })
  }

  ngOnInit(): void {
    this.activeRoute.queryParams
      .subscribe(params => {
        const projectId = params['projectId']

        this.projectService.getProjectById(projectId)
          .subscribe({
              next: (data: any) => {
                console.log(data)
                this.project.id = data['id']
                this.project.name = data['name']
                this.project.shortName = data['shortName']
                this.project.description = data['description']
                this.project.creatorId = data['creatorId']
                this.project.created = data['created']

                this.storeService.currentProject = data
              },
              error: (error: any) => {
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
          )

        this.taskService.getTasksFromProject(projectId)
          .subscribe({
              next: (data: any) => {
                this.tasks = data
              },
              error: (error: any) => {
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
          )
      })
  }
}
