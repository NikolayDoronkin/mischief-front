import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {CreateTask} from "../model/task/create.task";

@Injectable()
export class TaskService {
  constructor(private http: HttpClient) {
  }

  createTask(projectId: string, task: CreateTask) {
    return this.http.post('http://localhost:8081/project/' + projectId + '/ticket/create', task)
  }
  getTasksFromProject(projectId: string) {
    return this.http.get('http://localhost:8081/project/' + projectId + '/ticket')
  }

  getTaskFromProjectById(projectId: string, taskId: string) {
    return this.http.get('http://localhost:8081/project/' + projectId + '/ticket/' + taskId)
  }
}
