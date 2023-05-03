import {TaskResponse} from "../task/task.response";
import {Project} from "./project";

export class Dashboard {
  constructor(
    public totalProjects: number,
    public totalTicketsFromProjects: number,
    public totalTicketsFromProjectsInProgress: number,
    public totalTicketsFromProjectsInDone: number,
    public lastModifiedProjects: Project[],
    public lastModifiedTickets: TaskResponse[]
  ) {
  }
}
