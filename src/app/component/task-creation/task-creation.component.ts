import {Component, OnInit} from '@angular/core';
import {CreateTask} from "../../model/task/create.task";
import {TaskService} from "../../service/task.service";
import {ActivatedRoute, Router} from "@angular/router";
import {UserService} from "../../service/user.service";

@Component({
  selector: 'app-task-creation',
  templateUrl: './task-creation.component.html',
  styleUrls: ['./task-creation.component.css'],
  providers: [TaskService, UserService],
})
export class TaskCreationComponent implements OnInit{

  createTaskRequest: CreateTask = new CreateTask(
    "", "", "", "", "", "", "", ""
  )

  dropdownList: any = [];
  assignee: any = [];
  reviewer: any = [];
  dropdownSettings: any = {};

  filtersLoaded: Promise<boolean>;
  constructor(
    private taskService: TaskService,
    private userService: UserService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
  ) {}

  createTask() {
    this.activatedRoute.queryParams
      .subscribe(params => {
        const projectId = params['projectId']

        console.log(this.createTaskRequest.description)
        this.createTaskRequest.relatedProjectId = projectId
        this.taskService.createTask(projectId, this.createTaskRequest)
          .subscribe({
            next: (data: any) => {
              console.log(data)
              this.router.navigate(['task'], {
                queryParams:{
                  "projectId": projectId
                }
              })
            },
            error: (error: any) => console.log(error)
          })
      })
  }

  ngOnInit(): void {
    this.userService.getAllUsers()
      .subscribe({
        next: (data: any) => {
          data.forEach((user: { [x: string]: any; }) => {
            const id = user['id']
            const name= user['firstName'] + ' ' + user['lastName']
            this.dropdownList.push({ item_id: id, item_text: name })
            this.filtersLoaded = Promise.resolve(true)
          })
        },
        error: (error: any) => console.log(error)
      })
    this.dropdownSettings = {
      singleSelection: true,
      idField: 'item_id',
      textField: 'item_text',
      itemsShowLimit: 3,
      allowSearchFilter: true
    };
  }

  onItemSelect(item: any, selectBox: string, clear: boolean) {
    console.log(item)
    switch (selectBox){
      case 'assignee': {
        this.assignee.push(clear ? null : item);
        break;
      }
      case 'reviewer': {
        this.reviewer.push(clear ? null : item);
        break
      }
    }
    console.log(this.assignee)
    console.log(this.reviewer)
  }
}
