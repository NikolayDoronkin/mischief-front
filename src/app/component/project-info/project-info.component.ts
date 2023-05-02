import {Component, OnInit} from '@angular/core';
import {ProjectService} from "../../service/project.service";
import {ActivatedRoute, Router} from "@angular/router";
import {Project} from "../../model/project/project";
import {StoreService} from "../../service/store.service";
import {UserResponse} from "../../model/user/user.response";

@Component({
  selector: 'app-project-info',
  templateUrl: './project-info.component.html',
  styleUrls: ['./project-info.component.css'],
  providers: [ProjectService]
})
export class ProjectInfoComponent implements OnInit {

  project: Project = new Project("", "", "", "", "",
    new UserResponse("", "", "", "", []),
    new Date(), [], [])

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private projectService: ProjectService,
    private storeService: StoreService,
  ) {
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
                console.log(this.storeService.currentProject)
              },
              error: (error: any) => {
                console.log(error)
                if (error['status'] == 403) {
                  this.router.navigate(['login'])
                } else if (error['status'] >= 401) {
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
