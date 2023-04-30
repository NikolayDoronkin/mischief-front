import {UserResponse} from "../user/user.response";

export class Project {
  constructor(
    public id: string,
    public name: string,
    public shortName: string,
    public description: string,
    public creatorId: string,
    public creator: UserResponse,
    public created: Date,
    public users: UserResponse[],
    public accessedUserIds: string[],
  ) {}
}
