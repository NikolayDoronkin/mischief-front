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

const globalRoutes: Routes = [
  {path: '', component: LoginComponent},
  {path: 'login', component: LoginComponent},
  {path: 'signIn', component: RegisterComponent},
  {path: 'dashboard', component: DashboardComponent},
  {path: 'profile', component: ProfileComponent},
  {path: 'project', component: ProjectComponent},
  {path: 'project-info', component: ProjectInfoComponent},
  {path: 'project-creation', component: ProjectCreationComponent},
  {path: 'task-creation', component: TaskCreationComponent},
  {path: 'task-info', component: TaskInfoComponent},
  {path: 'team', component: TeamComponent},
  {path: 'task', component: TaskComponent},
  {path: '404', component: NotFoundComponent},
  {path: '401', component: UnauthorizedComponent},
  {path: '500', component: ServerErrorComponent},
  {path: '**', redirectTo: '404'},
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
    MatInputModule, MatNativeDateModule
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
