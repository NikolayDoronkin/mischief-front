import {Component, OnInit} from '@angular/core';
import {TaskService} from "../../service/task.service";
import {ProjectService} from "../../service/project.service";
import {ActivatedRoute, Router} from "@angular/router";
import {TaskResponse} from "../../model/task/task.response";
import {Project} from "../../model/project/project";
import {UserResponse} from "../../model/user/user.response";
import {CommentService} from "../../service/comment.service";
import {Comment} from "../../model/comment/comment";
import {StoreService} from "../../service/store.service";
import {FormControl, FormGroup} from "@angular/forms";

@Component({
  selector: 'app-task-info',
  templateUrl: './task-info.component.html',
  styleUrls: ['./task-info.component.css'],
  providers: [TaskService, ProjectService, CommentService],
})
export class TaskInfoComponent implements OnInit {

  reporterId: string
  assigneeId: string
  reviewerId: string

  statusError = ''

  currentDate: Date = new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate() + 1)
  updated: boolean = false
  commentValue: string = ''

  onCreationCommentDialog: boolean = false

  accessedUserIds: string[]
  subtasks: TaskResponse[] = []

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
  relatableDate1 = new FormGroup({
    finishing: new FormControl<Date | null>(null)
  })

  dropdownSettingsSingle: any = {};

  filtersLoaded1: Promise<boolean>;
  filtersLoaded2: Promise<boolean>;
  filtersLoaded3: Promise<boolean>;
  filtersLoaded: Promise<boolean>;

  taskInfo: TaskResponse = new TaskResponse(
    "", "", "", "ttt", "", "",
    "", new Date(), new Date(), "", "", "",
    "", "", "",
    new UserResponse("", "", "", "", "", "", "", "", "", "", []),
    new UserResponse("","", "", "", "", "", "",  "", "", "", []),
    new UserResponse("", "", "", "", "", "", "", "", "", "", []),
    [], [],
    new Project("", "", "", "", "",
      new UserResponse("","", "", "", "", "", "",  "", "", "", []),
      new Date(), [], []),
    [], 0)


  constructor(
    private router: Router,
    private activeRoute: ActivatedRoute,
    private taskService: TaskService,
    private projectService: ProjectService,
    private storeService: StoreService,
    private commentService: CommentService,
  ) {
  }

  onCreationCommentDialogChange() {
    this.onCreationCommentDialog = !this.onCreationCommentDialog
  }

  saveComment() {
    console.log(this.storeService.currentUser)
    console.log(this.taskInfo.id)
    this.commentService.createComment(
      new Comment('', this.storeService.currentUser, this.storeService.currentUser.id, new Date(), new Date(), this.taskInfo, this.commentValue)
    ).subscribe({
      next: (data: any) => {
        const task: TaskResponse = data['relatedTicket']
        this.goTaskInfo(task.relatedProjectId, task.id)
        this.onCreationCommentDialog = false
        this.commentValue = ''
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
  }

  updateTicket() {
    console.log(this.taskInfo)
    this.taskInfo.type = this.type.length > 0 ? this.type.pop()['item_text'] : null
    this.taskInfo.status = this.status.length > 0 ? this.status.pop()['item_text'] : null
    this.taskInfo.priorityName = this.priority.length > 0 ? this.priority.pop()['item_text'] : null
    this.taskInfo.assigneeId = this.assignee.length > 0 ? this.assignee.pop()['item_id'] : null
    this.taskInfo.reviewerId = this.reviewer.length > 0 ? this.reviewer.pop()['item_id'] : null

    let month = ''
    let day = ''
    let rawValue = this.relatableDate1.controls['finishing'].getRawValue();

    if (rawValue != undefined && typeof rawValue != "string") {
      let monthFromDatePicker = rawValue!.getMonth() + 1;
      let dateFromDatePicker = rawValue!.getDate();
      if (monthFromDatePicker < 10) {
        month = '0' + monthFromDatePicker
      } else {
        month = '' + monthFromDatePicker
      }
      if (dateFromDatePicker < 10) {
        day = '0' + dateFromDatePicker
      } else {
        day = '' + dateFromDatePicker
      }
      this.taskInfo.relatableFinishedDate = rawValue.getFullYear() + '-' + month + '-' + day
    } else {
      this.taskInfo.relatableFinishedDate = rawValue
    }
    console.log(this.taskInfo.relatableFinishedDate)
    this.taskService.updateTask(this.taskInfo).subscribe({
      next: (data: any) => {
        console.log(data)
        this.ngOnInit()
        window.location.reload()
        this.onUpdated = false
        this.taskInfo = data
      },
      error: (error: any) => {
        console.log(error)
        if (error['status'] == 403) {
          this.router.navigate(['login'])
        } else if (error['status'] == 404 || error['status'] == 400) {
          let errorElements = error['error'];
          this.statusError = errorElements['errors'][0];
          let indexOf = this.statusError.indexOf(':', 0);
          if (indexOf != -1) {
            this.statusError = this.statusError.substring(indexOf + 1, this.statusError.lastIndexOf(':'))
          }

          if (this.taskInfo.assignee != null) {
            this.assignee.push({
              item_id: this.taskInfo.assigneeId,
              item_text: this.taskInfo.assignee.firstName + ' ' + this.taskInfo.assignee.lastName
            })
          }
          if (this.taskInfo.reviewer != null) {
            this.reviewer.push({
              item_id: this.taskInfo.reviewer.id,
              item_text: this.taskInfo.reviewer.firstName + ' ' + this.taskInfo.reviewer.lastName
            })
          }
          this.type.push({item_id: 0, item_text: this.taskInfo.type})
          this.status.push({item_id: 0, item_text: this.taskInfo.status})
          this.priority.push({item_id: 0, item_text: this.taskInfo.priorityName})
          this.relatableDate = this.taskInfo.relatableFinishedDate
        }
      }
    })
  }

  goTaskInfo(projectId: string, taskId: string) {
    this.onUpdated = false
    this.commentService.getCommentsFromTicket(taskId)
      .subscribe({
        next: (data: any) => {
          console.log(data)
          this.taskInfo.comments = data
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
    this.router.navigate(['task-info'], {
      queryParams: {
        "taskId": taskId,
        "projectId": projectId
      }
    }).then(() => window.location.reload())
  }

  ngOnInit(): void {
    console.log(this.onCreationCommentDialog)
    this.activeRoute.queryParams
      .subscribe(params => {
        const projectId = params['projectId']
        const taskId = params['taskId']

        this.taskService.getTaskFromProjectById(projectId, taskId)
          .subscribe({
              next: (data: any) => {
                console.log(data)
                this.taskInfo.id = data['id']
                this.taskInfo.number = data['number']
                this.taskInfo.title = data['title']
                this.taskInfo.description = data['description']
                this.taskInfo.assigneeId = data['assigneeId']
                this.taskInfo.reporterId = data['reporterId']
                this.taskInfo.reviewerId = data['reviewerId']
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
                this.taskInfo.difficulty = data['difficulty']

                this.relatableDate = this.taskInfo.relatableFinishedDate

                if (this.taskInfo.assignee != null) {
                  this.assignee.push({
                    item_id: this.taskInfo.assigneeId,
                    item_text: this.taskInfo.assignee.firstName + ' ' + this.taskInfo.assignee.lastName
                  })
                }
                if (this.taskInfo.reviewer != null) {
                  this.reviewer.push({
                    item_id: this.taskInfo.reviewer.id,
                    item_text: this.taskInfo.reviewer.firstName + ' ' + this.taskInfo.reviewer.lastName
                  })
                }
                // this.type.push({item_id: 0, item_text: this.taskInfo.type})
                // this.status.push({item_id: 0, item_text: this.taskInfo.status})
                // this.priority.push({item_id: 0, item_text: this.taskInfo.priorityName})
                this.relatableDate = this.taskInfo.relatableFinishedDate
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

        this.commentService.getCommentsFromTicket(taskId).subscribe({
            next: (data: any) => {
              this.taskInfo.comments = data
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
          })

        this.taskService.getChildTasks(taskId).subscribe({
          next: (data: any) => {
            console.log(data)
            this.subtasks = data
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
        })

        this.projectService.getProjectById(projectId)
          .subscribe({
            next: (data: any) => {
              this.accessedUserIds = data['users'].map((user: UserResponse) => user.id)
              data['users'].forEach((user: { [x: string]: string; }) => {
                const id = user['id']
                const name = user['firstName'] + ' ' + user['lastName']
                this.dropdownListAccessedUsers.push({item_id: id, item_text: name})
              })
              this.filtersLoaded = Promise.resolve(true)
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
          })

        this.taskService.getAllTypes().subscribe({
          next: (data: any) => {
            let counter = 0;
            console.log(data)
            data.forEach((el: any) => {
              if (el == this.taskInfo.type) {
                console.log(el)
                this.type.push({item_id: counter, item_text: this.taskInfo.type})
              }
              this.dropdownListType.push({item_id: counter++, item_text: el})
            })
            this.filtersLoaded1 = Promise.resolve(true)
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
        })

        this.taskService.getAllStatuses().subscribe({
          next: (data: any) => {
            let counter = 0;
            data.forEach((el: any) => {
              if (el == this.taskInfo.status) {
                console.log(this.taskInfo.status)
                this.status.push({item_id: counter, item_text: this.taskInfo.status})
              }
              this.dropdownListStatus.push({item_id: counter++, item_text: el})
            })
            this.filtersLoaded2 = Promise.resolve(true)
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
        })

        this.taskService.getAllPriorities().subscribe({
          next: (data: any) => {
            let counter = 0;
            data.forEach((el: any) => {
              if (el == this.taskInfo.priorityName) {
                console.log(this.taskInfo.priorityName)
                this.priority.push({item_id: counter, item_text: this.taskInfo.priorityName})
              }
              this.dropdownListPriority.push({item_id: counter++, item_text: el})
            })
            this.filtersLoaded3 = Promise.resolve(true)
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
        })
      })

    this.dropdownSettingsSingle = {
      singleSelection: true,
      idField: 'item_id',
      textField: 'item_text',
      itemsShowLimit: 3,
      allowSearchFilter: true,
      showSelectedItemsAtTop: false
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
      case 'type': {
        if (!clear) {
          this.type.push(item)
        } else {
          this.type.pop(item)
        }
        break
      }
      case 'status': {
        if (!clear) {
          this.status.push(item)
        } else {
          this.status.pop(item)
        }
        break
      }
      case 'priority': {
        if (!clear) {
          this.priority.push(item)
        } else {
          this.priority.pop(item)
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
    this.updated = true
  }
}
