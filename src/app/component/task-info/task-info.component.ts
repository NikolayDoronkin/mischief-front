import {Component, OnInit} from '@angular/core';
import {TaskService} from "../../service/task.service";
import {ProjectService} from "../../service/project.service";
import {ActivatedRoute, Router} from "@angular/router";
import {TaskResponse} from "../../model/task/task.response";
import {Project} from "../../model/project/project";
import {UserResponse} from "../../model/user/user.response";
import {DatePipe} from "@angular/common";

@Component({
  selector: 'app-task-info',
  templateUrl: './task-info.component.html',
  styleUrls: ['./task-info.component.css'],
  providers: [TaskService, ProjectService, DatePipe],
})
export class TaskInfoComponent implements OnInit {

  subtasks: TaskResponse[] = []

  currentDate = new Date()
  onUpdated: boolean = false

  dropdownListAccessedUsers: any = [];
  dropdownListType: any = [];
  dropdownListStatus: any = [];
  dropdownListPriority: any = [];

  assignee: any = [];
  reviewer: any = [];
  type: any = [];
  status: any = [];
  priority: any = [];
  relatableDate: any

  dropdownSettingsSingle: any = {};

  filtersLoaded1: Promise<boolean>;
  filtersLoaded2: Promise<boolean>;
  filtersLoaded3: Promise<boolean>;
  filtersLoaded: Promise<boolean>;

  taskInfo: TaskResponse = new TaskResponse(
    "", "", "", "ttt", "", "",
    "", new Date(), new Date(), "", "", "",
    "", "", "",
    new UserResponse("", "", "", "", []),
    new UserResponse("", "", "", "", []),
    new UserResponse("", "", "", "", []),
    [], [],
    new Project("", "", "", "", "",
      new UserResponse("", "", "", "", []),
      new Date(), [], []))


  constructor(
    private router: Router,
    private activeRoute: ActivatedRoute,
    private taskService: TaskService,
    private projectService: ProjectService,
    private datePipe: DatePipe
  ) {
  }

  updateTicket() {

    console.log(this.type)
    this.taskInfo.type = this.type.pop()['item_text']
    this.taskInfo.status = this.status.pop()['item_text']
    this.taskInfo.priorityName = this.priority.pop()['item_text']
    this.taskInfo.assigneeId = this.assignee.pop()['item_id']
    this.taskInfo.reviewerId = this.reviewer.pop()['item_id']
    let month = ''
    let day = ''
    if (this.relatableDate['month'] < 10) {
      month = '0' + this.relatableDate['month']
    } else {
      month = this.relatableDate['month']
    }
    if (this.relatableDate['day'] < 10) {
      day = '0' + this.relatableDate['day']
    } else {
      day = this.relatableDate['day']
    }
    this.taskInfo.relatableFinishedDate = this.relatableDate['year'] + '-' + month + '-' + day
    console.log(this.taskInfo.relatableFinishedDate)
    console.log(this.relatableDate)

    this.taskService.updateTask(this.taskInfo).subscribe({
      next: (data: any) => {
        console.log(data)
        this.ngOnInit()
        window.location.reload()
        this.onUpdated = false
        this.taskInfo = data
      },
      error: (error: any) => console.log(error)
    })
  }

  goTaskInfo(projectId: string, taskId: string) {
    console.log('here ticket!!')
    this.onUpdated = false
    this.router.navigate(['task-info'], {
      queryParams:{
        "taskId": taskId,
        "projectId": projectId
      }
    })
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
                this.taskInfo.listeners = data['listeners']
                this.taskInfo.accessableUsers = data['accessableUsers']
                this.taskInfo.relatedProject = data['relatedProject']
                this.taskInfo.reporter = data['reporter']
                this.taskInfo.assignee = data['assignee']
                this.taskInfo.reviewer = data['reviewer']
                console.log(data)
                console.log(this.taskInfo)

                this.assignee.push({
                  item_id: this.taskInfo.assigneeId,
                  item_text: this.taskInfo.assignee.firstName + ' ' + this.taskInfo.assignee.lastName
                })
                this.reviewer.push({
                  item_id: this.taskInfo.reviewer.id,
                  item_text: this.taskInfo.reviewer.firstName + ' ' + this.taskInfo.reviewer.lastName
                })
                this.type.push({item_id: 0, item_text: this.taskInfo.type})
                this.status.push({item_id: 0, item_text: this.taskInfo.status})
                this.priority.push({item_id: 0, item_text: this.taskInfo.priorityName})
                this.relatableDate = this.taskInfo.relatableFinishedDate
              },
              error: err => console.log(err)
            }
          )

        this.taskService.getChildTasks(taskId).subscribe({
          next: (data: any) => {
            console.log(data)
            this.subtasks = data
          }
        })

        this.projectService.getProjectById(projectId)
          .subscribe({
            next: (data: any) => {
              data['users'].forEach((user: { [x: string]: string; }) => {
                const id = user['id']
                const name = user['firstName'] + ' ' + user['lastName']
                this.dropdownListAccessedUsers.push({item_id: id, item_text: name})
              })
              this.filtersLoaded = Promise.resolve(true)
            },
            error: (error: any) => console.log(error)
          })

        this.taskService.getAllTypes().subscribe({
          next: (data: any) => {
            let counter = 0;
            data.forEach((el: any) => this.dropdownListType.push({item_id: counter++, item_text: el}))
            this.filtersLoaded1 = Promise.resolve(true)
          },
          error: (error: any) => console.log(error)
        })

        this.taskService.getAllStatuses().subscribe({
          next: (data: any) => {
            let counter = 0;
            data.forEach((el: any) => this.dropdownListStatus.push({item_id: counter++, item_text: el}))
            this.filtersLoaded2 = Promise.resolve(true)
          },
          error: (error: any) => console.log(error)
        })

        this.taskService.getAllPriorities().subscribe({
          next: (data: any) => {
            let counter = 0;
            data.forEach((el: any) => this.dropdownListPriority.push({item_id: counter++, item_text: el}))
            this.filtersLoaded3 = Promise.resolve(true)
          },
          error: (error: any) => console.log(error)
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
      case 'reviewer': {
        if (!clear) {
          this.reviewer.push(item)
        } else {
          this.reviewer.pop(item)
        }
        break
      }
    }
  }

  protected readonly DatePipe = DatePipe;
}