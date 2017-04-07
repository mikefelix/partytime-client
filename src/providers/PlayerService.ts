import {Injectable, OnInit} from "@angular/core";
import {Http} from "@angular/http";
import {Quest} from "./Quest";
import {Player} from "./Player";
import "rxjs/Rx";
import "rxjs/add/operator/toPromise";
import {Score} from "./Score";

@Injectable()
export class PlayerService implements OnInit {
  players: Array<Player>;
  scores: Array<Score>;

  constructor(private http: Http) {
  }

  ngOnInit(){
    this.http.get(`http://localhost:9000/games/1/players}`)
      .map(r => {
        this.players = r.json() as Player[];
      })
  }

  getPlayer(player: number, refresh = false) {
    if (refresh){
      this.players[player] = undefined;
    }

    if (this.players && this.players[player]){
      //noinspection TypeScriptUnresolvedFunction
      return new Promise((resolve, reject) => {
        resolve(this.players[player]);
      });
    }

    return this.http.get(`http://localhost:9000/games/1/players/${player}`)
      .map(r => {
        return r.json() as Player;
      })
      .toPromise()
  }

  getScores(refresh = false){
    if (refresh)
      this.scores = undefined;

    if (this.scores) {
      //noinspection TypeScriptUnresolvedFunction
      return new Promise((resolve, reject) => {
        resolve(this.scores);
      });
    }

    return this.http.get(`http://localhost:9000/games/1/scores`)
      .map(r => {
        return r.json() as Score[];
      })
      .toPromise()
  }

  getPlayersExcept(except: number){
    return this.http.get(`http://localhost:9000/games/1/players`)
      .map(r => {
        let arr = r.json() as Player[];
        arr.filter( p => p.id != except );
        return arr;
      })
      .toPromise()
  }

}
