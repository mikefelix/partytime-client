import {Injectable, OnInit} from "@angular/core";
import {Http, Response} from "@angular/http";
import {Quest} from "./Quest";
import {Player} from "./Player";
import "rxjs/Rx";
import "rxjs/add/operator/toPromise";
import {Score} from "./Score";
import {AppSettings} from "./AppSettings";
import {Observable} from 'rxjs/Observable';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';

@Injectable()
export class PlayerService implements OnInit {
  players: Array<Player> = [];
  scores: Array<Score>;

  public currentPlayerSubject: BehaviorSubject<Player> = new BehaviorSubject<Player>(new Player(0));
  public otherPlayersSubject: BehaviorSubject<Player[]> = new BehaviorSubject<Player[]>([]);

  constructor(private http: Http) {
  }

  ngOnInit(){
    this.http.get(`${AppSettings.API_URL}/games/1/players}`)
      .map(r => {
        this.players = r.json() as Player[];
      })
  }

  wakeUp(){
    // setTimeout(() => this.pollAlerts(this.http), 5000);
    this.pollPlayers(this.http);
  }

  pollPlayers(http: Http){
    //noinspection TypeScriptUnresolvedFunction
    http.get(`${AppSettings.API_URL}/games/1/players`)
      .map((res: Response) => {
        let players = (res.json() as Player[]) || [];
        this.otherPlayersSubject.next(players);
        setTimeout(() => this.pollPlayers(http), 30000);
      })
      .catch((error:any) => Observable.throw(error.json().error || 'Server error'))
      .toPromise();
  }

  createPlayer(playerName: string, heroName: string){
    return this.http.post(`${AppSettings.API_URL}/games/1/players`, JSON.stringify({
      game: 1,
      name: playerName,
      alias: heroName
    })).map(r => {
      return r.json() as Player;
    })
      .catch((error:any) => Observable.throw(error.json().error || 'Server error'))
      .toPromise()
  }

  getPlayer(playerId: number, refresh = false) {
    let id = playerId.toString();
    console.log('getPlayer ' + id);
    if (refresh && id){
      this.players[id] = undefined;
    }

    if (id === '0' || id === undefined){
      //noinspection TypeScriptUnresolvedFunction
      return new Promise((resolve, reject) => {
        resolve(undefined);
      });
    }

    if (this.players && this.players[id]){
      //noinspection TypeScriptUnresolvedFunction
      return new Promise((resolve, reject) => {
        resolve(this.players[id]);
      });
    }

    //noinspection TypeScriptUnresolvedFunction
    return this.http.get(`${AppSettings.API_URL}/games/1/players/${id}`)
      .map(r => {
        let player = r.json() as Player;
        this.players[id] = player;
        return player;
      })
      .toPromise()
  }

  refreshCurrentPlayer(id){
    return this.http.get(`${AppSettings.API_URL}/games/1/players/${id}`)
      .map(r => {
        let player = r.json() as Player;
        this.players[id] = player;
        this.currentPlayerSubject.next(player);
        return player;
      })
      .toPromise()
  }

/*
  getScores(refresh = false){
    if (refresh)
      this.scores = undefined;

    if (this.scores) {
      //noinspection TypeScriptUnresolvedFunction
      return new Promise((resolve, reject) => {
        resolve(this.scores);
      });
    }

    return this.http.get(`${AppSettings.API_URL}/games/1/scores`)
      .map(r => {
        let scores = r.json() as Score[];
        this.scores = scores;
        return scores;
      })
      .toPromise()
  }

  getPlayersExcept(except: number){
    console.log('GPE ' + except);
    return this.http.get(`${AppSettings.API_URL}/games/1/players`)
      .map(r => {
        let arr = r.json() as Player[];
        arr = arr.filter( p => p.id != except );
        for (let p of arr){
          this.players[p.id] = p;
        }

        return arr;
      })
      .toPromise()
  }*/

}
