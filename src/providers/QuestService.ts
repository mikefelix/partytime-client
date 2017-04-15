import {Injectable, OnInit} from "@angular/core";
import {Http} from "@angular/http";
import {Quest} from "./Quest";
import "rxjs/Rx";
import "rxjs/add/operator/toPromise";
import {AppSettings} from "./AppSettings";
import {BehaviorSubject} from 'rxjs/BehaviorSubject';

@Injectable()
export class QuestService {
  started: boolean;
  public questSubject: BehaviorSubject<Quest> = new BehaviorSubject<Quest>(new Quest(0));
  public sidequestSubject: BehaviorSubject<Quest> = new BehaviorSubject<Quest>(new Quest(0));

  constructor(private http: Http) {
  }

  wakeUp(){
    // setTimeout(() => this.pollAlerts(this.http), 5000);
    this.pollQuests(this.http);
    // this.testPoll();
  }

  pollQuests(http: Http) {
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
