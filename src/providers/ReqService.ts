import {Injectable, OnInit} from "@angular/core";
import {Http} from "@angular/http";
import {Item} from "./Item";
import "rxjs/Rx";
import "rxjs/add/operator/toPromise";
import {Score} from "./Score";
import {AppSettings} from "./AppSettings";

@Injectable()
export class ReqService implements OnInit {
  items: Array<Item>;
  scores: Array<Score>;

  constructor(private http: Http) {
  }

  ngOnInit(){
    this.http.get(`${AppSettings.API_URL}/games/1/items}`)
      .map(r => {
        this.items = r.json() as Item[];
      })
  }

  getItem(item: number, refresh = false) {
    if (refresh){
      this.items[item] = undefined;
    }

    if (this.items && this.items[item]){
      //noinspection TypeScriptUnresolvedFunction
      return new Promise((resolve, reject) => {
        resolve(this.items[item]);
      });
    }

    return this.http.get(`${AppSettings.API_URL}/games/1/items/${item}`)
      .map(r => {
        return r.json() as Item;
      })
      .toPromise()
  }

}
