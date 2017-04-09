import {Injectable} from "@angular/core";
import {Http, Response} from "@angular/http";
import "rxjs/Rx";
import "rxjs/add/operator/toPromise";
import {Player} from "./Player";
import {AppSettings} from "./AppSettings";

@Injectable()
export class LoginService {
  //noinspection TypeScriptUnresolvedVariable
  // player: Promise<Player> = {
  //   name: 'Mr. Buttkix',
  //   id: 1
  // };

  private loginUrl = `${AppSettings.API_URL}/login`;

  constructor(private http: Http) {
  }

  login(username, password) {
    let body = `username=${username}&password=${password}`;
    this.http.post(this.loginUrl, body)
      .map((res: Response) => {
        let player = res.json();
        localStorage.setItem('playerId', player.id);
      });
      // .catch((error: any) => Observable.throw(error.json().error || 'Server error'))
      // .toPromise();
  }

  getId(){
    return +localStorage.getItem('player');
  }

}
