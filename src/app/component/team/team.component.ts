import {Component, Inject, OnInit} from '@angular/core';
import {ProjectService} from "../../service/project.service";
import {ActivatedRoute, Router} from "@angular/router";
import {UserResponse} from "../../model/user/user.response";
import {MAT_DIALOG_DATA, MatDialog} from "@angular/material/dialog";
import {UserService} from "../../service/user.service";

@Component({
  selector: 'app-team',
  templateUrl: './team.component.html',
  styleUrls: ['./team.component.css'],
  providers: [ProjectService, UserService]
})
export class TeamComponent implements OnInit {

  dropdownList: any = [];
  selectedItems: any = new Set([]);
  dropdownSettings: any = {};
  filtersLoaded: Promise<boolean>

  searchFilter: string = ''
  defaultPage = 0
  defaultSize = 10

  page: number
  size: number
  totalElements: number
  numberOfElements: number
  totalPages: number
  pageNumbers: number[] = []

  users: UserResponse[] = []
  projectId: string = ''
  currentUserId: string
  currentProjectOwnerId: string

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private projectService: ProjectService,
    private userService: UserService,
    private dialog: MatDialog
  ) {
  }

  deleteUserFromProject(id: string) {
    console.log(this.projectId)
    this.projectService.deleteMemberFromProject(this.projectId, id).subscribe({
      next: (data: any) => {
        console.log(data)
        this.router.navigate(['team'], {
          queryParams: {
            "projectId": this.projectId
          }
        }).then(() => {
          window.location.reload()
        })
      },
      error: (error: any) => {
        console.log(error)
        if (error['status'] == 403) {
          this.router.navigate(['login'])
        }
      }
    })
  }

  openUserProfilePopUp(userId: string) {
    const dialogRef =
      this.dialog.open(DialogContentExampleDialog, {
        data: {
          id: userId
        }
      });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }

  findByPage(projectId: string, page: number, size: number, searchFilter?: string) {
    let search = typeof searchFilter == "undefined" ? '' : searchFilter;
    if (search.length < 2) {
      search = ''
    }

    this.projectService.getTeamMembers(projectId, page, size, search)
      .subscribe({
        next: (data: any) => {
          this.users = data['content']

          this.size = data['size']
          this.page = data['number']
          this.totalElements = data['totalElements']
          this.numberOfElements = data['numberOfElements']
          this.totalPages = data['totalPages'];

          this.pageNumbers = [...Array(this.totalPages).keys()].map(x => ++x);
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
  }

  addNewMembers() {
    const newMemberIds = this.selectedItems.map((item: { [x: string]: any; }) => item['item_id'])

    this.projectService.addNewMembers(this.projectId, newMemberIds).subscribe({
      next: (data: any) => {
        window.location.reload()
      },
      error: err => console.log(err)
    })
  }

  ngOnInit(): void {
    this.activatedRoute.queryParams
      .subscribe(params => {
        const projectId = params['projectId']
        this.projectId = projectId

        this.findByPage(projectId, this.defaultPage, this.defaultSize)
        this.projectService.getProjectById(projectId).subscribe({
          next: (data: any) => {
            this.currentProjectOwnerId = data['creatorId']
          }
        })
        this.userService.getCurrentUser().subscribe({
          next: (data: any) => {
            this.currentUserId = data['id']
          }
        })
        this.userService.getAllUsers()
          .subscribe({
            next: (data: any) => {
              const memberIds = this.users.map((user: UserResponse) => user.id)

              data.forEach((user: { [x: string]: any; }) => {
                const id = user['id']
                const name= user['firstName'] + ' ' + user['lastName']
                if (!memberIds.includes(id)) {
                  this.dropdownList.push({ item_id: id, item_text: name })
                }
                this.filtersLoaded = Promise.resolve(true)
              })
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
        this.dropdownSettings = {
          singleSelection: false,
          idField: 'item_id',
          textField: 'item_text',
          selectAllText: 'Select All',
          unSelectAllText: 'UnSelect All',
          itemsShowLimit: 3,
          allowSearchFilter: true
        };
      })
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

@Component({
  selector: 'dialog-content-example-dialog',
  templateUrl: 'dialog-content-example-dialog.html',
})
export class DialogContentExampleDialog {
  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {
  }
}
