import {Injectable, OnInit} from "@angular/core";
import {Http, Response} from "@angular/http";

import "rxjs/Rx";
import "rxjs/add/operator/toPromise";
import {Observable} from 'rxjs/Observable';
import {Player} from "./Player";
import {Chat} from "./Chat";
import {AppSettings} from "./AppSettings";
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {LoginService} from "./LoginService";
import {QuestService} from "./QuestService";
import {PlayerService} from "./PlayerService";

@Injectable()
export class ChatService {
  public alertsSubject: BehaviorSubject<Chat[]> = new BehaviorSubject<Chat[]>([]);


  // id = ' rand ' + Math.random();
  // count = 1;
  //
  // public weirdoSubject: BehaviorSubject<string> = new BehaviorSubject<string>(this.id);

  // injectWeirdo(){
    // this.weirdoSubject.next(this.id + '|' + this.count++);
    // setTimeout(() => this.injectWeirdo(), 10000);
  // }



  constructor(private http: Http, private loginService: LoginService, private questService: QuestService, private playerService: PlayerService) {
  }

  /*
   subscribeChats(): Observable<Comment[]> {
    return this.http.get(this.chatsUrl)
      .map((res: Response) => res.json() || {})
      .catch((error:any) => Observable.throw(error.json().error || 'Server error'));
  }
*/

  wakeUp(){
    // setTimeout(() => this.pollAlerts(this.http), 5000);
    this.pollAlerts(this.http);
    // this.injectWeirdo();
  }

  pollAlerts(http: Http){
    let id = this.loginService.getId();
    if (!id){
      console.log('No player ID.');
      setTimeout( () => this.pollAlerts(http), 5000);
      return;
    }

    //noinspection TypeScriptUnresolvedFunction
    http.get(`${AppSettings.API_URL}/games/1/players/${id}/alerts`)
      .map((res:Response) => {
        let alerts = (res.json() as Chat[]) || [];
        this.alertsSubject.next(alerts);
        for (let alert of alerts){
          this.respondToServerEvents(alert);
        }

        setTimeout(() => this.pollAlerts(http), 5000);
      })
      .catch((error:any) => Observable.throw(error.json().error || 'Server error'))
      .toPromise();
  }

  respondToServerEvents(alert: Chat){
    let playerId = this.loginService.getId();
    if (/^Quest invitation accepted/.test(alert.chat)) {
      // TODO: make this only poll the first time somehow
      console.log('Invite accepted, refreshing everything.');
      this.questService.refreshQuest(playerId);
      this.questService.refreshSidequest(playerId);
    }

    else if (/^Trade completed/.test(alert.chat)) {
      console.log('Trade completed, refreshing everything.');
      this.playerService.refreshCurrentPlayer(playerId);
      this.questService.refreshQuest(playerId);
      this.questService.refreshSidequest(playerId);
    }

    else if (/^Quest completed/.test(alert.chat)) {
      console.log('Quest completed, refreshing everything.');
      this.questService.refreshQuest(playerId);
      this.questService.refreshSidequest(playerId);
    }

    else if (/^Ally abandoned quest/.test(alert.chat)){
      this.questService.refreshQuest(playerId);
    }
  }

  markAlertRead(id: number) {
    //noinspection TypeScriptUnresolvedFunction
    return this.http.delete(`${AppSettings.API_URL}/games/1/alerts/${id}`)
      .map( res => {
        // this.alerts = undefined;
        return res;
      })
      .catch((error:any) => Observable.throw(error.json().error || 'Server error'))
      .toPromise()
  }

  getLatest(player: Player){
    //noinspection TypeScriptUnresolvedFunction
    return this.http.get(`${AppSettings.API_URL}/games/1/chats`)
      .map((res: Response) => res.json() as Chat[])
      .catch((error:any) => Observable.throw(error.json().error || 'Server error'))
      .toPromise()
  }

  // getAlerts(player: number, refresh: boolean = false){
    // let alerts = this.alerts;
    // if (!alerts || refresh) {
    //   return this.http.get(`${AppSettings.API_URL}/games/1/players/${player}/alerts`)
    //     .map((res:Response) => {
    //       this.alerts = (res.json() as Chat[]) || [];
    //       let alerts = (res.json() as Chat[]) || [];
          // this.alertsSubject.next(alerts);
          // setTimeout(() => this.alerts = undefined);
          // return this.alerts;
        // })
        // .catch((error:any) => Observable.throw(error.json().error || 'Server error'))
        // .toPromise()
    // }
    // else {
    //   return new Promise((resolve, reject) => {
    //     resolve(this.alerts);
    //   });
    // }
  // }

  postChat(body){
    return this.http.post(`${AppSettings.API_URL}/games/1/players/${body.poster}/chats`, JSON.stringify(body))
      .map((res: Response) => res.json() as Chat[])
      .catch((error:any) => Observable.throw(error.json().error || 'Server error'))
      .toPromise()
  }
}
