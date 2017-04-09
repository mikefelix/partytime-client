import {Injectable, OnInit} from "@angular/core";
import {Http, Response} from "@angular/http";
import {Player} from "./Player";
import "rxjs/Rx";
import "rxjs/add/operator/toPromise";
import {Trade} from "./Trade";
import {TradeStage} from "./TradeStage";
import {AppSettings} from "./AppSettings";

@Injectable()
export class TradeService implements OnInit {

  constructor(private http: Http) {
  }

  ngOnInit(){
  }

  getTradesForPlayer(player: number, refresh = false) {
    return this.http.get(`${AppSettings.API_URL}/games/1/players/${player}/trades`)
      .map(r => {
        return r.json() as Trade[];
      })
      .toPromise()
  }

  getTrade(player: number, id: number, refresh = false) {
    return this.http.get(`${AppSettings.API_URL}/games/1/players/${player}/trades/${id}`)
      .map(r => {
        return r.json() as Trade;
      })
      .toPromise()
  }

  offerTrade(trade: Trade) {
    trade.stage = TradeStage.Offered;
    let body = JSON.stringify(trade);
    return this.http.post(`${AppSettings.API_URL}/games/1/players/${trade.offerer}/trades`, body)
      .toPromise()
  }

  counterofferTrade(trade: Trade) {
    trade.stage = TradeStage.Counteroffered;
    let body = JSON.stringify(trade);
    return this.http.put(`${AppSettings.API_URL}/games/1/players/${trade.offeree}/trades/${trade.id}`, body)
      .toPromise()
  }

  acceptTrade(trade: Trade) {
    trade.stage = TradeStage.Accepted;
    let body = JSON.stringify(trade);
    return this.http.put(`${AppSettings.API_URL}/games/1/players/${trade.offerer}/trades/${trade.id}`, body)
      .toPromise()
  }

  rejectTrade(trade: Trade) {
    trade.stage = TradeStage.Rejected;
    let body = JSON.stringify(trade);
    return this.http.put(`${AppSettings.API_URL}/games/1/players/${trade.offerer}/trades/${trade.id}`, body)
      .toPromise()
  }

  getOfferOptions(player: Player) {
    return this.http.get(`${AppSettings.API_URL}/games/1/players/${player.id}/offeroptions`)
      .map(r => {
        return r.json() as Array<Object>;
      })
      .toPromise()
  }
}
