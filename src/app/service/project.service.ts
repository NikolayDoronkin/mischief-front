import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Project} from "../model/project/project";

@Injectable()
export class ProjectService {
  constructor(private http: HttpClient) {
  }

  getStatistics(projectId: string) {
    return this.http.get('http://localhost:8081/project/' + projectId + '/statistics')
  }

  getProjectDashboard(projectId: string) {
    return this.http.get('http://localhost:8081/project/' + projectId + '/getDashboardForProject')
  }

  getDashboard() {
    return this.http.get('http://localhost:8081/project/getDashboard')
  }

  deleteMemberFromProject(projectId: string, userId: string) {
    return this.http.post('http://localhost:8081/project/delete/' + projectId + '/delete/' + userId, {})
  }
  getTeamMembers(id: string, page: number, size: number) {
    return this.http.get('http://localhost:8081/project/' + id + '/members' + '?page=' + page + '&size=' + size)
  }
  getAllAccessedProject(id: string, page: number, size: number, searchFilter?: string) {
    return this.http.get('http://localhost:8081/project/findByCreatorId/' + id + '?searchFilter=' + searchFilter + '&page=' + page + '&size=' + size)
  }

  getProjectById(id: string) {
    return this.http.get('http://localhost:8081/project/' + id)
  }

  createProject(project: Project) {
    return this.http.post('http://localhost:8081/project/create', project)
  }
}
