import {Component, Inject, OnInit} from '@angular/core';
import {ProjectService} from "../../service/project.service";
import {ActivatedRoute, Router} from "@angular/router";
import {UserResponse} from "../../model/user/user.response";
import {MAT_DIALOG_DATA, MatDialog} from "@angular/material/dialog";

@Component({
  selector: 'app-team',
  templateUrl: './team.component.html',
  styleUrls: ['./team.component.css'],
  providers: [ProjectService]
})
export class TeamComponent implements OnInit {

  users: UserResponse[] = []
  projectId: string = ''

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private projectService: ProjectService,
    private dialog: MatDialog
  ) {}

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
      error: (error: any) => console.log(error)
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
  ngOnInit(): void {
    this.activatedRoute.queryParams
      .subscribe(params => {
        const projectId = params['projectId']
        this.projectId = projectId

        this.projectService.getTeamMembers(projectId)
          .subscribe({
            next: (data: any) => {
              this.users = data
            },
            error: (error: any) => console.log(error)
          })
    })
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
