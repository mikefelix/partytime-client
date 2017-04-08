import {Injectable} from "@angular/core";
import {Http, Response} from "@angular/http";

import "rxjs/Rx";
import "rxjs/add/operator/toPromise";
import {Observable} from 'rxjs/Observable';
import {Player} from "./Player";
import {Chat} from "./Chat";

@Injectable()
export class ChatService {
  private data: Observable<number[]>;
  private values: number[] = [];
  private anyErrors: string[];
  private finished: boolean;

  private chatsUrl = 'http://mozzarelly.com/chats';

  constructor(private http: Http) {
  }

  subscribeChats(): Observable<Comment[]> {
    return this.http.get(this.chatsUrl)
      .map((res: Response) => res.json() || {})
      .catch((error:any) => Observable.throw(error.json().error || 'Server error'));
  }

  getLatest(player: Player){
    return this.http.get(`http://localhost:9000/games/1/players/${player.id}/chats`)
      .map((res: Response) => res.json() as Chat[])
      .catch((error:any) => Observable.throw(error.json().error || 'Server error'))
      .toPromise()
  }

  postChat(body){
    return this.http.post(`http://localhost:9000/games/1/players/${body.poster}/chats`, JSON.stringify(body))
      .map((res: Response) => res.json() as Chat[])
      .catch((error:any) => Observable.throw(error.json().error || 'Server error'))
      .toPromise()
  }
}
