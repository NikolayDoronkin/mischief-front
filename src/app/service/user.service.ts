import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {LoginUser} from "../model/user/login.user";
import {SignInUser} from "../model/user/signin.user";
import {UpdateUser} from "../model/user/update.user";

@Injectable()
export class UserService {
  constructor(private http: HttpClient) {
  }

  getAllUsers() {
    return this.http.get('http://localhost:8081/user/getAll')
  }
  updateUser(user: UpdateUser) {
    return this.http.post('http://localhost:8081/user/update', user)
  }

  getUserById(userId: string) {
    return this.http.get('http://localhost:8081/user/' + userId)
  }

  getCurrentUser() {
    return this.http.get('http://localhost:8081/user/current')
  }

  signIn(user: SignInUser) {
    return this.http.post('http://localhost:8081/user/create', user)
      .subscribe({
        next: (data: any) => {console.log(data)},
        error: err => console.log(err)
      });
  }

  logIn(user: LoginUser) {
    return this.http.post('http://localhost:8081/login', user)
  }
}
