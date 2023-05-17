import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import {RouterModule, Routes} from "@angular/router";

import {AppComponent} from './app.component';
import {MainComponent} from './component/main/main.component';
import {LoginComponent} from './component/login/login.component';
import {NgbAlertModule, NgbDatepickerModule, NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {RegisterComponent} from './component/register/register.component';
import {DashboardComponent} from './component/dashboard/dashboard.component';
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import { ProfileComponent } from './component/profile/profile.component';
import { MenuComponent } from './component/menu/menu.component';
import { HeaderComponent } from './component/header/header.component';
import { FooterComponent } from './component/footer/footer.component';
import { ProjectComponent } from './component/project/project.component';
import { ProjectInfoComponent } from './component/project-info/project-info.component';
import { ProjectCreationComponent } from './component/project-creation/project-creation.component';
import { TaskInfoComponent } from './component/task-info/task-info.component';
import { TaskComponent } from './component/task/task.component';
import { TaskCreationComponent } from './component/task-creation/task-creation.component';
import {DialogContentExampleDialog, TeamComponent} from './component/team/team.component';
import {AuthInterceptor} from "./service/auth.interceptor";
import {StoreService} from "./service/store.service";
import {NgMultiSelectDropDownModule} from "ng-multiselect-dropdown";
import {JsonPipe, NgOptimizedImage} from "@angular/common";
import {MatDialogModule} from "@angular/material/dialog";
import { NotFoundComponent } from './component/not-found/not-found.component';
import { UnauthorizedComponent } from './component/unauthorized/unauthorized.component';
import { ServerErrorComponent } from './component/server-error/server-error.component';
import {MatSelectModule} from "@angular/material/select";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatDatepickerModule} from "@angular/material/datepicker";
import {MatIconModule} from "@angular/material/icon";
import {MatInputModule} from "@angular/material/input";
import {MAT_DATE_FORMATS, MatNativeDateModule} from "@angular/material/core";
import {MatButtonModule} from "@angular/material/button";

const globalRoutes: Routes = [
  {path: '', component: LoginComponent, data: {title: 'LOGIN'}},
  {path: 'login', component: LoginComponent,  data: {title: 'LOGIN'}},
  {path: 'signIn', component: RegisterComponent,  data: {title: 'SIGN IN'}},
  {path: 'dashboard', component: DashboardComponent,  data: {title: 'DASHBOARD'}},
  {path: 'profile', component: ProfileComponent,  data: {title: 'PROFILE'}},
  {path: 'project', component: ProjectComponent,  data: {title: 'PROJECTS'}},
  {path: 'project-info', component: ProjectInfoComponent,  data: {title: 'PROJECT-INFO'}},
  {path: 'project-creation', component: ProjectCreationComponent, data: {title: 'PROJECT CREATION'}},
  {path: 'task-creation', component: TaskCreationComponent, data: {title: 'TASK CREATION'}},
  {path: 'task-info', component: TaskInfoComponent, data: {title: 'TASK INFO'}},
  {path: 'team', component: TeamComponent, data: {title: 'TEAM MEMBERS'}},
  {path: 'task', component: TaskComponent, data: {title: 'TASKS'}},
  {path: '404', component: NotFoundComponent, data: {title: 'OOPS! 404'}},
  {path: '401', component: UnauthorizedComponent, data: {title: 'OOPS! 401'}},
  {path: '500', component: ServerErrorComponent, data: {title: 'OOPS! 500'}},
  {path: '**', redirectTo: '404'}
]

@NgModule({
  declarations: [
    AppComponent,
    MainComponent,
    LoginComponent,
    RegisterComponent,
    DashboardComponent,
    ProfileComponent,
    MenuComponent,
    HeaderComponent,
    FooterComponent,
    ProjectComponent,
    ProjectInfoComponent,
    ProjectCreationComponent,
    TaskInfoComponent,
    TaskComponent,
    TaskCreationComponent,
    TeamComponent,
    DialogContentExampleDialog,
    NotFoundComponent,
    UnauthorizedComponent,
    ServerErrorComponent
  ],
    imports: [
        BrowserModule,
        NgbModule,
        FormsModule,
        MatFormFieldModule,
        HttpClientModule,
        NgbDatepickerModule, NgbAlertModule, JsonPipe,
        RouterModule.forRoot(globalRoutes, {onSameUrlNavigation: 'reload'}),
        BrowserAnimationsModule,
        NgMultiSelectDropDownModule.forRoot(),
        MatDialogModule, NgOptimizedImage, MatSelectModule,
        ReactiveFormsModule, MatDatepickerModule, MatIconModule,
        MatInputModule, MatNativeDateModule, MatButtonModule
    ],
  providers: [
    {
      provide : HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi   : true,
    },
    StoreService
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
