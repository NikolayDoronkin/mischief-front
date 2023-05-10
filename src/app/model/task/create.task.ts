export class CreateTask {
  constructor(
    public title: string,
    public type: string,
    public status: string,
    public description: string,
    public assigneeId: string,
    public relatedProjectId: string,
    public reviewerId: string,
    public priorityName: string,
    public parentTicketId: string,
    public difficulty: number
  ) {}
}
