import {Injectable, OnInit} from "@angular/core";
import {Http, Response} from "@angular/http";
import {Player} from "./Player";
import "rxjs/Rx";
import "rxjs/add/operator/toPromise";
import {Trade} from "./Trade";
import {AppSettings} from "./AppSettings";
import {Invite} from "./Invite";

@Injectable()
export class TradeService implements OnInit {

  constructor(private http: Http) {
  }

  ngOnInit(){
  }

  getTradesForPlayer(player: number, refresh = false) {
    //noinspection TypeScriptUnresolvedFunction
    return this.http.get(`${AppSettings.API_URL}/games/1/players/${player}/trades`)
      .map(r => {
        return r.json() as Trade[];
      })
      .toPromise()
  }

  getTrade(player: number, id: number, refresh = false) {
    //noinspection TypeScriptUnresolvedFunction
    return this.http.get(`${AppSettings.API_URL}/games/1/players/${player}/trades/${id}`)
      .map(r => {
        return r.json() as Trade;
      })
      .toPromise()
  }

  getInvite(player: number, id: number, refresh = false) {
    //noinspection TypeScriptUnresolvedFunction
    return this.http.get(`${AppSettings.API_URL}/games/1/players/${player}/invites/${id}`)
      .map(r => {
        return r.json() as Invite;
      })
      .toPromise()
  }

  offerTrade(trade: Trade) {
    trade.stage = 1; //TradeStage.Offered;
    let body = JSON.stringify(trade);
    //noinspection TypeScriptUnresolvedFunction
    return this.http.post(`${AppSettings.API_URL}/games/1/players/${trade.offerer}/trades`, body)
      .map ( (res: Response) => res.json()['message'] as string )
      .toPromise()
  }

  offerInvite(invite: Invite) {
    invite.stage = 1; //InviteStage.Offered;
    let body = JSON.stringify(invite);
    //noinspection TypeScriptUnresolvedFunction
    return this.http.post(`${AppSettings.API_URL}/games/1/players/${invite.invitee}/invites`, body)
      .map ( (res: Response) => res.json()['message'] as string )
      .toPromise()
  }

  counterofferTrade(trade: Trade) {
    trade.stage = 2; //TradeStage.Counteroffered;
    let body = JSON.stringify(trade);
    console.log('body: ' + body);
    //noinspection TypeScriptUnresolvedFunction
    return this.http.put(`${AppSettings.API_URL}/games/1/players/${trade.offeree}/trades/${trade.id}`, body)
      .map ( (res: Response) => res.json()['message'] as string )
      .toPromise()
  }

  acceptTrade(trade: Trade) {
    trade.stage = 3; //TradeStage.Accepted;
    let body = JSON.stringify(trade);
    //noinspection TypeScriptUnresolvedFunction
    return this.http.put(`${AppSettings.API_URL}/games/1/players/${trade.offerer}/trades/${trade.id}`, body)
      .map ( (res: Response) => res.json()['message'] as string )
      .toPromise()
  }

  rejectTrade(trade: Trade) {
    trade.stage = 4; //TradeStage.Rejected;
    let body = JSON.stringify(trade);
    //noinspection TypeScriptUnresolvedFunction
    return this.http.put(`${AppSettings.API_URL}/games/1/players/${trade.offerer}/trades/${trade.id}`, body)
      .map ( (res: Response) => res.json()['message'] as string )
      .toPromise()
  }

  acceptInvite(invite: Invite) {
    invite.stage = 2; //InviteStage.Accepted;
    let body = JSON.stringify(invite);
    //noinspection TypeScriptUnresolvedFunction
    return this.http.put(`${AppSettings.API_URL}/games/1/players/${invite.invitee}/invites/${invite.id}`, body)
      .map ( (res: Response) => res.json()['message'] as string )
      .toPromise()
  }

  rejectInvite(invite: Invite) {
    invite.stage = 3; //InviteStage.Rejected;
    let body = JSON.stringify(invite);
    //noinspection TypeScriptUnresolvedFunction
    return this.http.put(`${AppSettings.API_URL}/games/1/players/${invite.invitee}/invites/${invite.id}`, body)
      .map ( (res: Response) => res.json()['message'] as string )
      .toPromise()
  }

  getOfferOptions(player: Player) {
    //noinspection TypeScriptUnresolvedFunction
    return this.http.get(`${AppSettings.API_URL}/games/1/players/${player.id}/offeroptions`)
      .map(r => {
        return r.json() as Array<Object>;
      })
      .toPromise()
  }
}
