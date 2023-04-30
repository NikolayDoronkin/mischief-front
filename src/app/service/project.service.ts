import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Project} from "../model/project/project";

@Injectable()
export class ProjectService {
  constructor(private http: HttpClient) {
  }
  getAllAccessedProject(id: string) {
    return this.http.get('http://localhost:8081/project/findByCreatorId/' + id)
  }

  getProjectById(id: string) {
    return this.http.get('http://localhost:8081/project/' + id)
  }

  createProject(project: Project) {
    return this.http.post('http://localhost:8081/project/create', project)
  }
}
