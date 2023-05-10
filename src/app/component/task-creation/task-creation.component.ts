import {Component, OnInit} from '@angular/core';
import {CreateTask} from "../../model/task/create.task";
import {TaskService} from "../../service/task.service";
import {ActivatedRoute, Router} from "@angular/router";
import {UserService} from "../../service/user.service";
import {ProjectService} from "../../service/project.service";
import {Project} from "../../model/project/project";

@Component({
  selector: 'app-task-creation',
  templateUrl: './task-creation.component.html',
  styleUrls: ['./task-creation.component.css'],
  providers: [TaskService, UserService, ProjectService],
})
export class TaskCreationComponent implements OnInit {

  createTaskRequest: CreateTask = new CreateTask(
    "", "", "", "", "", "", "", "", ""
  )

  dropdownList: any = [];
  dropdownListTickets: any = [];
  assignee: any = [];
  reviewer: any = [];
  parentTicket: any = [];
  dropdownSettingsSingle: any = {};

  filtersLoaded: Promise<boolean>;
  filtersLoaded1: Promise<boolean>;

  constructor(
    private taskService: TaskService,
    private userService: UserService,
    private projectService: ProjectService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
  ) {
  }

  createTask() {
    this.activatedRoute.queryParams
      .subscribe(params => {
        const projectId = params['projectId']

        const assigneeId = this.assignee.map((it: { [x: string]: any; }) => it['item_id']);
        const reviewerId = this.reviewer.map((it: { [x: string]: any; }) => it['item_id']);
        const parentTicketId = this.parentTicket.map((it: { [x: string]: any; }) => it['item_id'])

        this.createTaskRequest.assigneeId = assigneeId[0]
        this.createTaskRequest.reviewerId = reviewerId[0]
        this.createTaskRequest.parentTicketId = parentTicketId[0]

        console.log(this.createTaskRequest.description)
        this.createTaskRequest.relatedProjectId = projectId
        this.taskService.createTask(projectId, this.createTaskRequest)
          .subscribe({
            next: (data: any) => {
              console.log(data)
              this.router.navigate(['task'], {
                queryParams: {
                  "projectId": projectId
                }
              })
            },
            error: (error: any) => {
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
          })
      })
  }

  ngOnInit(): void {

    this.activatedRoute.queryParams
      .subscribe(params => {
        const projectId = params['projectId']
        let projectShortName = ''

        this.projectService.getProjectById(projectId)
          .subscribe({
            next: (data: any) => {
              projectShortName = data['shortName']
              data['users'].forEach((user: { [x: string]: string; }) => {
                const id = user['id']
                const name = user['firstName'] + ' ' + user['lastName']
                this.dropdownList.push({item_id: id, item_text: name})
              })
              this.filtersLoaded = Promise.resolve(true)
            },
            error: (error: any) => {
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
          })

        this.taskService.getTasksFromProjectNotPageable(projectId).subscribe({
          next: (data: any) => {
            data.forEach((task: { [x: string]: any; }) => {
              console.log(task)
              const id = task['id']
              const project: Project = task['relatedProject']
              console.log(project)
              const name = project.shortName + '-' + task['number'] + ' - ' + task['title']

              this.dropdownListTickets.push({item_id: id, item_text: name})
            })
            console.log(this.dropdownListTickets)
            this.filtersLoaded1 = Promise.resolve(true)
          },
          error: (error: any) => {
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
        })
      })

    this.dropdownSettingsSingle = {
      singleSelection: true,
      idField: 'item_id',
      textField: 'item_text',
      itemsShowLimit: 3,
      allowSearchFilter: true
    };
  }

  onItemSelect(item: any, selectBox: string, clear: boolean) {
    console.log(item)
    switch (selectBox) {
      case 'assignee': {
        if (!clear) {
          this.assignee.push(item)
        } else {
          this.assignee.pop(item)
        }
        break
      }
      case 'subtask': {
        if (!clear) {
          this.parentTicket.push(item)
        } else {
          this.parentTicket.pop(item)
        }
        break
      }
    }
  }
}
