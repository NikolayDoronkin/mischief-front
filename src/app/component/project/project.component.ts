import {Component, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {UserService} from "../../service/user.service";
import {StoreService} from "../../service/store.service";
import {Project} from "../../model/project/project";
import {UserResponse} from "../../model/user/user.response";
import {ProjectService} from "../../service/project.service";

@Component({
  selector: 'app-project',
  templateUrl: './project.component.html',
  styleUrls: ['./project.component.css'],
  providers: [ProjectService]
})
export class ProjectComponent implements OnInit {

  projects: Project[] = []

  constructor(
    private router: Router,
    private storeService: StoreService,
    private projectService: ProjectService,
  ) {
  }

  goProjectCreation() {
    this.router.navigate(['project-creation'])
  }

  goProject(id: string) {
    this.router.navigate(['project-info'],
      {
        queryParams: {
          projectId: id
        }
      })
  }

  ngOnInit(): void {
    console.log(this.storeService.currentUser)
    this.projectService.getAllAccessedProject(this.storeService.currentUser.id)
      .subscribe({
        next: (data: any) => {
          console.log(data)
          this.projects = data
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
}
