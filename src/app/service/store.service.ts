import {Injectable} from "@angular/core";
import {UserResponse} from "../model/user/user.response";
import {Project} from "../model/project/project";

@Injectable({ providedIn: 'root' })
export class StoreService {
  currentUser: UserResponse
  currentProject: Project
  /*= new UserResponse("", "", "", "", [])*/
  // projects: UserResponse = new UserResponse("", "", "", "")

}
