import {Component, OnInit} from '@angular/core';
import {ProjectService} from "../../service/project.service";
import {Router} from "@angular/router";
import {Project} from "../../model/project/project";
import {UserService} from "../../service/user.service";
import {UserResponse} from "../../model/user/user.response";

@Component({
  selector: 'app-project-creation',
  templateUrl: './project-creation.component.html',
  styleUrls: ['./project-creation.component.css'],
  providers: [ProjectService, UserService]
})
export class ProjectCreationComponent implements OnInit{

  project: Project = new Project("", "", "", "", "",
    new UserResponse("", "", "", "", []),
    new Date(), [], [])

  dropdownList: any = [];
  selectedItems: any = new Set([]);
  dropdownSettings: any = {};

  filtersLoaded: Promise<boolean>;

  constructor(
    private router: Router,
    private projectService: ProjectService,
    private userService: UserService,
  ) {}
  createProject() {
    console.log(this.project)
    this.project.accessedUserIds = this.selectedItems.map((item: { [x: string]: any; }) => item['item_id'])

    this.projectService.createProject(this.project)
      .subscribe({
        next: (data: any) => {
          this.router.navigate(['project'])
        },
        error: (error: any) => {
          console.log(error)
          if (error['status'] == 403) {
            this.router.navigate(['login'])
          }
          else if (error['status'] >= 401) {
            this.router.navigate(['401'])
          }
          else if (error['status'] >= 500) {
            this.router.navigate(['500'])
          }
        }
      })
  }

  async ngOnInit() {
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
        error: (error: any) => {
          console.log(error)
          if (error['status'] == 403) {
            this.router.navigate(['login'])
          }
          else if (error['status'] >= 401) {
            this.router.navigate(['401'])
          }
          else if (error['status'] >= 500) {
            this.router.navigate(['500'])
          }
        }
      })
    this.dropdownSettings = {
      singleSelection: false,
      idField: 'item_id',
      textField: 'item_text',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 3,
      allowSearchFilter: true
    };
  }

  onItemSelect(item: any) {
    console.log(item)
    this.selectedItems.push(item)
    console.log(this.selectedItems)
  }

  onDeSelect(item: any) {
    console.log(item)
    this.selectedItems.pop(item)
    console.log(this.selectedItems)
  }
  onSelectAll(items: any, toSelect: boolean) {
    if (toSelect) items.forEach((item: any) => this.selectedItems.push(item))
    else this.selectedItems.splice(0, this.selectedItems.length)
    console.log(this.selectedItems)
  }
}
