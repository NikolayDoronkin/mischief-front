import {Injectable} from "@angular/core";
import {UserResponse} from "../model/user/user.response";

@Injectable({ providedIn: 'root' })
export class StoreService {
  currentUser: UserResponse /*= new UserResponse("", "", "", "", [])*/
  // projects: UserResponse = new UserResponse("", "", "", "")

}
