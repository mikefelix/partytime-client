import {Injectable} from "@angular/core";
import {Http, Response} from "@angular/http";

import "rxjs/Rx";
import "rxjs/add/operator/toPromise";
import {Observable} from 'rxjs/Observable';
import {Player} from "./Player";
import {Chat} from "./Chat";
import {AppSettings} from "./AppSettings";

@Injectable()
export class ChatService {
  alerts: Chat[];

  constructor(private http: Http) {
  }

/*
  subscribeChats(): Observable<Comment[]> {
    return this.http.get(this.chatsUrl)
      .map((res: Response) => res.json() || {})
      .catch((error:any) => Observable.throw(error.json().error || 'Server error'));
  }
*/

  getLatest(player: Player){
    return this.http.get(`${AppSettings.API_URL}/games/1/players/${player.id}/chats`)
      .map((res: Response) => res.json() as Chat[])
      .catch((error:any) => Observable.throw(error.json().error || 'Server error'))
      .toPromise()
  }

  getAlerts(player: number, refresh: boolean = false){
    let alerts = this.alerts;
    if (!alerts || refresh) {
      return this.http.get(`${AppSettings.API_URL}/games/1/players/${player}/alerts`)
        .map((res:Response) => {
          this.alerts = (res.json() as Chat[]) || [];
          setTimeout(() => this.alerts = undefined);
        })
        .catch((error:any) => Observable.throw(error.json().error || 'Server error'))
        .toPromise()
    }
    else {
      return new Promise((resolve, reject) => {
        resolve(this.alerts);
      });
    }
  }

  postChat(body){
    return this.http.post(`${AppSettings.API_URL}/games/1/players/${body.poster}/chats`, JSON.stringify(body))
      .map((res: Response) => res.json() as Chat[])
      .catch((error:any) => Observable.throw(error.json().error || 'Server error'))
      .toPromise()
  }
}
