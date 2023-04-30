import {Component, OnInit} from '@angular/core';
import {ProjectService} from "../../service/project.service";
import {ActivatedRoute} from "@angular/router";
import {Project} from "../../model/project/project";

@Component({
  selector: 'app-project-info',
  templateUrl: './project-info.component.html',
  styleUrls: ['./project-info.component.css'],
  providers: [ProjectService]
})
export class ProjectInfoComponent implements OnInit {

  project: Project = new Project("", "", "", "", "", new Date(), [])
  constructor(
    private router: ActivatedRoute,
    private projectService: ProjectService,
  ) {
  }

  ngOnInit(): void {
    this.router.queryParams
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
              },
              error: err => console.log(err)
            }
          )

      })
  }
}
