import {Injectable, OnInit} from "@angular/core";
import {Http, Response} from "@angular/http";
import {Quest} from "./Quest";
import "rxjs/Rx";
import "rxjs/add/operator/toPromise";
import {AppSettings} from "./AppSettings";
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {LoginService} from "./LoginService";

@Injectable()
export class QuestService {
  started: boolean;
  public questSubject: BehaviorSubject<Quest> = new BehaviorSubject<Quest>(new Quest(0));
  public sidequestSubject: BehaviorSubject<Quest> = new BehaviorSubject<Quest>(new Quest(0));

  constructor(private http: Http, private loginService: LoginService) {
  }

  wakeUp(){
    // setTimeout(() => this.pollAlerts(this.http), 5000);
    this.pollQuests(this.loginService.getId(), this.http);
    // this.testPoll();
  }

  // testPoll(){
  //   this.testSubject.next(this.id + '|' + this.count++); setTimeout(() => this.testPoll(), 1000)
  // }

  pollQuests(player: number, http: Http){
    //noinspection TypeScriptUnresolvedFunction
    http.get(`${AppSettings.API_URL}/games/1/players/${player}/quest`)
      .map((res: Response) => {
        let quest = (res.json() as Quest);
        console.log('QuestService: refresh quest');
        this.questSubject.next(quest);
      })
      .toPromise();

    http.get(`${AppSettings.API_URL}/games/1/players/${player}/sidequest`)
      .map((res: Response) => {
        let quest = (res.json() as Quest);
        console.log('QuestService: refresh sidequest');
        this.sidequestSubject.next(quest);
      })
      .toPromise();

    setTimeout(() => this.pollQuests(player, http), 40000);
  }

  getQuest(quest: number) {
    return this.http.get(`${AppSettings.API_URL}/games/1/quests/${quest}`)
      .map(r => {
        return r.json() as Quest;
      })
      .toPromise()
  }

  refreshQuest(player: number) {
    console.log('QuestService: refresh quest for player ' + player);
    return this.http.get(`${AppSettings.API_URL}/games/1/players/${player}/quest`)
      .map(r => {
        let quest = r.json() as Quest;
        // if (quest && quest.id != 0)
          this.questSubject.next(quest);

        return quest;
      })
      .toPromise()
  }

  refreshSidequest(player: number) {
    console.log('QuestService: refresh sidequest for player ' + player);
    return this.http.get(`${AppSettings.API_URL}/games/1/players/${player}/sidequest`)
      .map(r => {
        let quest = r.json() as Quest;
        // if (quest && quest.id != 0)
          this.sidequestSubject.next(quest);

        return quest;
      })
      .toPromise()
  }

  completeQuest(player: number) {
    return this.http.delete(`${AppSettings.API_URL}/games/1/players/${player}/quest`)
      .map(r => {
        return r.json() as Quest;
      })
      .toPromise()
  }

  leaveSidequest(player: number) {
    return this.http.delete(`${AppSettings.API_URL}/games/1/players/${player}/sidequest`)
      .map(r => {
        return r.json() as Quest;
      })
      .toPromise()
  }

  gameIsStarted(){
    if (this.started){
      //noinspection TypeScriptUnresolvedFunction
      return new Promise((resolve, reject) => {
        resolve(true);
      });
    }

    return this.http.get(`${AppSettings.API_URL}/games/1`)
      .map(r => {
        let game = r.json();
        if (game && game.started !== undefined)
          this.started = game.started;

        return this.started;
      })
      .toPromise()
  }
}
