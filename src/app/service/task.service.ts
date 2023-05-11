import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {CreateTask} from "../model/task/create.task";
import {TaskResponse} from "../model/task/task.response";

@Injectable()
export class TaskService {
  constructor(private http: HttpClient) {
  }

  updateTask(task: TaskResponse) {
    return this.http.post('http://localhost:8081/ticket/update', task)
  }

  getChildTasks(ticketId: string){
    return this.http.get('http://localhost:8081/ticket/' + ticketId + '/child')
  }

  getAllTypes(){
    return this.http.get('http://localhost:8081/ticket/getTicketTypes')
  }

  getAllStatuses() {
    return this.http.get('http://localhost:8081/ticket/getTicketStatuses')
  }

  getAllPriorities() {
    return this.http.get('http://localhost:8081/ticket/getTicketPriorities')
  }
  createTask(projectId: string, task: CreateTask) {
    return this.http.post('http://localhost:8081/project/' + projectId + '/ticket/create', task)
  }
  getTasksFromProject(projectId: string, page: number, size: number, search: string) {
    return this.http.get('http://localhost:8081/project/' + projectId + '/ticket' + '?searchFilter=' + search + '&page=' + page + '&size=' + size)
  }

  getTasksFromProjectNotPageable(projectId: string) {
    return this.http.get('http://localhost:8081/project/' + projectId + '/ticket')
  }

  getTaskFromProjectById(projectId: string, taskId: string) {
    return this.http.get('http://localhost:8081/project/' + projectId + '/ticket/' + taskId)
  }
}
