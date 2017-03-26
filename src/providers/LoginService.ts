import {Injectable} from "@angular/core";
import {Http, Response} from "@angular/http";
import "rxjs/Rx";
import "rxjs/add/operator/toPromise";
import {Player} from "./Player";

@Injectable()
export class LoginService {
  //noinspection TypeScriptUnresolvedVariable
  // player: Promise<Player> = {
  //   name: 'Mr. Buttkix',
  //   id: 1
  // };

  private loginUrl = 'http://localhost:9000/login';

  constructor(private http: Http) {
  }

  login(username, password) {
    let body = `username=${username}&password=${password}`;
    this.http.post(this.loginUrl, body)
      .map((res: Response) => {
        let player = res.json();
        localStorage.setItem('player', JSON.stringify(player));
      });
      // .catch((error: any) => Observable.throw(error.json().error || 'Server error'))
      // .toPromise();
  }

  getPlayer(id: number) {
    return this.http.get(`http://localhost:9000/games/1/players/${id}`)
      .map(r => {
        console.dir(r);
        return r.json() as Player;
      })
      .toPromise();

/*
    let p = localStorage.getItem('player');
    if (p)
      return p;
    else
      return {
        alias: 'Mr. Buttkix',
        name: 'Brandon',
        id: 1,
        items:[]
      }
*/
  }
}
