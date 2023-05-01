import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Comment} from "../model/comment/comment";

@Injectable()
export class CommentService {

  constructor(private http: HttpClient) {
  }

  getCommentsFromTicket(ticketId: string) {
    return this.http.get('http://localhost:8081/comment/fromTicket/' + ticketId)
  }
  createComment(comment: Comment) {
    return this.http.post('http://localhost:8081/comment/create', comment)
  }
}
