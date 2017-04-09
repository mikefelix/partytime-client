import {Injectable, OnInit} from "@angular/core";
import {Http} from "@angular/http";
import {Quest} from "./Quest";
import {Player} from "./Player";
import "rxjs/Rx";
import "rxjs/add/operator/toPromise";
import {AppSettings} from "./AppSettings";

@Injectable()
export class QuestService implements OnInit {
  started: boolean;
  constructor(private http: Http) {
  }

  ngOnInit(){
  }

  getQuestForPlayer(player: number, refresh = false) {
    return this.http.get(`${AppSettings.API_URL}/games/1/players/${player}/quest`)
      .map(r => {
        return r.json() as Quest;
      })
      .toPromise()
  }

  getSidequestForPlayer(player: number, refresh = false) {
    return this.http.get(`${AppSettings.API_URL}/games/1/players/${player}/sidequest`)
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
        if (game && game.started)
          this.started = true;

        return this.started
      })
      .toPromise()
  }
}
