export class Project {
  constructor(
    public id: string,
    public name: string,
    public shortName: string,
    public description: string,
    public creatorId: string,
    public created: Date,
    public accessedUserIds: string[],
  ) {}
}
