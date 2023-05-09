import {Project} from "../project/project";

export class UserResponse {
  constructor(
    public id: string,
    public firstName: string,
    public lastName: string,
    public login: string,
    public description: string,
    public address: string,
    public city: string,
    public country: string,
    public image: string,
    public email: string,
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
