import {Component, OnInit} from '@angular/core';
import {TaskService} from "../../service/task.service";
import {ProjectService} from "../../service/project.service";
import {ActivatedRoute, Router} from "@angular/router";
import {TaskResponse} from "../../model/task/task.response";
import {Project} from "../../model/project/project";
import {UserResponse} from "../../model/user/user.response";

@Component({
  selector: 'app-task-info',
  templateUrl: './task-info.component.html',
  styleUrls: ['./task-info.component.css'],
  providers: [TaskService, ProjectService],
})
export class TaskInfoComponent implements OnInit{

  taskInfo: TaskResponse = new TaskResponse(
    "", "", "", "ttt", "",
    "", new Date(), new Date(), new Date(), "", "",
    "", "", "",
    new UserResponse("", "", "", "", []),
    new UserResponse("", "", "", "", []),
    new UserResponse("", "", "", "", []),
    [], [],
    new Project("", "", "", "", "", new Date(), []))
  constructor(
    private router: Router,
    private activeRoute: ActivatedRoute,
    private taskService: TaskService,
    private projectService: ProjectService,
  ) {
  }
  ngOnInit(): void {
    this.activeRoute.queryParams
      .subscribe(params => {
        const projectId = params['projectId']
        const taskId = params['taskId']

        this.taskService.getTaskFromProjectById(projectId, taskId)
          .subscribe({
              next: (data: any) => {
                this.taskInfo.id = data['id']
                this.taskInfo.number = data['number']
                this.taskInfo.title = data['title']
                this.taskInfo.description = data['description']
                this.taskInfo.assigneeId = data['assigneeId']
                this.taskInfo.reporterId = data['reporterId']
                this.taskInfo.created = data['created']
                this.taskInfo.updated = data['updated']
                this.taskInfo.relatableFinishedDate = data['relatableFinishedDate']
                this.taskInfo.priorityName = data['priorityName']
                this.taskInfo.status = data['status']
                this.taskInfo.relatedProjectId = data['relatedProjectId']
                this.taskInfo.type = data['type']
                this.taskInfo.parentTicketId = data['parentTicketId']
                // this.taskInfo.reporterFirstName = data['reporter[\'firstName\']']
                // this.taskInfo.reporterLastName = data['reporter.lastName']
                // this.taskInfo.assigneeFirstName = data['assignee.firstName']
                // this.taskInfo.assigneeLastName = data['assignee.lastName']
                // this.taskInfo.reviewerFirstName = data['reviewer.firstName']
                // this.taskInfo.reviewerLastName = data['reviewer.lastName']
                this.taskInfo.listeners = data['listeners']
                this.taskInfo.accessableUsers = data['accessableUsers']
                this.taskInfo.relatedProject = data['relatedProject']
                this.taskInfo.reporter = data['reporter']
                this.taskInfo.assignee = data['assignee']
                this.taskInfo.reviewer = data['reviewer']
                console.log(data)
                console.log(this.taskInfo)
              },
              error: err => console.log(err)
            }
          )
      })
  }
}
