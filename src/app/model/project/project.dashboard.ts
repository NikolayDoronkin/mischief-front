import {TaskResponse} from "../task/task.response";

export class ProjectDashboard {
  constructor(
    public totalTicketsFromProject: number,
    public done: number,
    public inProgress: number,
    public onReview: number,
    public lastUpdatedTickets: TaskResponse[],
  ) {
  }
}

