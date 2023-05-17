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

  searchFilter: string = ''

  projects: Project[] = []
  defaultPage = 0
  defaultSize = 10

  page: number
  size: number
  totalElements: number
  numberOfElements: number
  totalPages: number
  pageNumbers: number[] = []

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

  findByPage(size: number, page: number, searchFilter?: string) {
    let search = typeof searchFilter == "undefined" ? '' : searchFilter;
    if (search.length < 2) {
      search = ''
    }
    this.projectService.getAllAccessedProject(this.storeService.currentUser.id, page, size, search)
      .subscribe({
        next: (data: any) => {

          this.projects = data['content']

          this.size = data['size']
          this.page = data['number']
          this.totalElements = data['totalElements']
          this.numberOfElements = data['numberOfElements']
          this.totalPages = data['totalPages'];

          this.pageNumbers = [...Array(this.totalPages).keys()].map(x => ++x);
        },
        error: (error: any) => {
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
    this.findByPage(this.defaultSize, this.defaultPage)
  }
}
