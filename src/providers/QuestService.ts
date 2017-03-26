import {Injectable, OnInit} from "@angular/core";
import {Http} from "@angular/http";
import {Quest} from "./Quest";
import "rxjs/Rx";
import "rxjs/add/operator/toPromise";

@Injectable()
export class QuestService implements OnInit {
  //noinspection TypeScriptUnresolvedVariable
  data: Promise<Quest>;

  constructor(private http: Http) {
  }

  ngOnInit(){
  }

  getQuestForPlayer(player: number, refresh = false) {
    return this.http.get(`http://localhost:9000/games/1/players/${player}/quest`)
      .map(r => {
        console.dir(r);
        return r.json() as Quest;
      })
      .toPromise()
  }

  getSidequestForPlayer(player: number, refresh = false) {
    return this.http.get(`http://localhost:9000/games/1/players/${player}/sidequest`)
      .map(r => {
        console.dir(r);
        return r.json() as Quest;
      })
      .toPromise()
  }

}
