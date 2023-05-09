import {Component, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {StoreService} from "../../service/store.service";
import {Project} from "../../model/project/project";
import {ProjectService} from "../../service/project.service";

@Component({
  selector: 'app-project',
  templateUrl: './project.component.html',
  styleUrls: ['./project.component.css'],
  providers: [ProjectService]
})
export class ProjectComponent implements OnInit {

  projects: Project[] = []
  defaultPage = 0
  defaultSize = 10

  page: number
  size: number
  totalElements: number
  numberOfElements: number
  totalPages: number


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

  findByPage1($event: any, page: number) {
    console.log($event)
    console.log(page)
  }
  findByPage(size: number, page: number) {
    this.projectService.getAllAccessedProject(this.storeService.currentUser.id, page, size)
      .subscribe({
        next: (data: any) => {
          console.log(data)
          this.projects = data['content']
          this.size = data['size']
          this.totalElements = data['totalElements']
          this.numberOfElements = data['numberOfElements']
          this.totalPages = data['totalPages']
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

  ngOnInit(): void {
    console.log(this.storeService.currentUser)
    this.findByPage(this.defaultSize, this.defaultPage)
  }

    protected readonly onmouseenter = onmouseenter;
}
