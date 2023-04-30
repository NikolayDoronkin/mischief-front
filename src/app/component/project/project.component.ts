import {Component, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {UserService} from "../../service/user.service";
import {StoreService} from "../../service/store.service";
import {Project} from "../../model/project/project";
import {UserResponse} from "../../model/user/user.response";

@Component({
  selector: 'app-project',
  templateUrl: './project.component.html',
  styleUrls: ['./project.component.css'],
  providers: [UserService]
})
export class ProjectComponent implements OnInit {

  projects: Project[] = []

  constructor(
    private router: Router,
    private storeService: StoreService,
    private userService: UserService,
  ) {
  }

  goProjectCreation() {
    this.router.navigate(['project-creation'])
  }

  goProject(id: string) {
    console.log('project-info')
    this.router.navigate(['project-info'],
      {
        queryParams: {
          projectId: id
        }
      })
  }

  ngOnInit(): void {
    this.userService.getCurrentUser()
      .subscribe({
        next: (data: any) => {
          console.log(data['creatorProjects'])
          this.storeService.currentUser = new UserResponse(
            data['id'],
            data['firstName'],
            data['lastName'],
            data['login'],
            data['creatorProjects'],
          )
          this.projects = this.storeService.currentUser.creatorProjects
        },
        error: err => console.log(err)
      })
  }
}
