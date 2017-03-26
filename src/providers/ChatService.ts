import {Injectable} from "@angular/core";
import {Http, Response} from "@angular/http";

import "rxjs/Rx";
import "rxjs/add/operator/toPromise";
import {Observable} from 'rxjs/Observable';

@Injectable()
export class ChatService {
  private data: Observable<number[]>;
  private values: number[] = [];
  private anyErrors: string[];
  private finished: boolean;

  private chatsUrl = 'http://mozzarelly.com/chats';

  constructor(private http: Http) {
  }

  subscribeChats(cb) : Observable<Comment[]> {

       // ...using get request
       return this.http.get(this.chatsUrl)
                       .map((res: Response) => res.json())
                       .catch((error:any) => Observable.throw(error.json().error || 'Server error'));

   }


}
