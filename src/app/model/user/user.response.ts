import {Project} from "../project/project";

export class UserResponse {
  constructor(
    public id: string,
    public firstName: string,
    public lastName: string,
    public login: string,
    public creatorProjects: Project[]
  ) {
  }

  createFromObject(obj: Object) {
    obj && Object.assign(this, obj)
    // return new UserResponse()
  }
  isEmpty(): boolean {
    return this.id == '' && this.firstName == '' && this.lastName == '' && this.login == ''
  }
}
