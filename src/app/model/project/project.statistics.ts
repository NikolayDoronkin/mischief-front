import {UserResponse} from "../user/user.response";

export class ProjectStatistics {
  constructor(
    public performance: number,
    public user: UserResponse
  ) {
  }
}
