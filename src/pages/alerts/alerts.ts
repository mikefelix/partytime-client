import { Component, OnInit } from '@angular/core';

import {ChatService} from "../../providers/ChatService";
import {Player} from "../../providers/Player";
import {Chat} from "../../providers/Chat";
import {PlayerService} from "../../providers/PlayerService";
import {LoginService} from "../../providers/LoginService";
import {PopoverController} from "ionic-angular/index";
import {TradePage} from "../trade/trade";
import {TradeService} from "../../providers/TradeService";
import {Trade} from "../../providers/Trade";
import {InvitePage} from "../invite/invite";
import {Invite} from "../../providers/Invite";

@Component({
  selector: 'page-alerts',
  templateUrl: 'alerts.html'
})
export class AlertsPage implements OnInit {
  alerts: Chat[];
  player: Player;
  enteredChat: string;

  constructor(public chatService: ChatService, private popoverCtrl: PopoverController, private playerService: PlayerService,
              private loginService: LoginService, private tradeService: TradeService) {
    this.alerts = [];
  }

  ngOnInit() {
    this.chatService.alertsSubject.subscribe(
      alerts => {
        this.alerts = alerts;
      }
    );

    this.playerService.getPlayer(this.loginService.getId()).then((player: Player) => {
      this.player = player;
      // this.refreshAlerts();
    });
  }

  // refreshAlerts(){
  //   this.chatService.getAlerts(this.player.id, true).then((alerts: Chat[]) => {
  //     this.alerts = alerts;
  //   });
  // }

  handleClick(alert: Chat, event){
    if (!alert.poster && alert.poster == 0){
      // 1. Accept a join proposal
      if (/^Quest invitation received/.test(alert.chat)){
        let inviteId = +alert.chat.match(/\{([0-9]+)\}$/)[1];
        this.respondToInvite(inviteId, alert.id, event)
      }

      if (/^Quest invitation (accepted|rejected)/.test(alert.chat)){
        let inviteId = +alert.chat.match(/\{([0-9]+)\}$/)[1];
        this.describeInvite(inviteId, alert.id, event)
      }

      // 2. Accept a trade invitation
      if (/^Trade request/.test(alert.chat)){
        let tradeId = +alert.chat.match(/\{([0-9]+)\}$/)[1];
        this.respondToTradeRequest(tradeId, alert.id, event);
      }

      // 3. Accept a trade response
      if (/^Trade response/.test(alert.chat)){
        let tradeId = +alert.chat.match(/\{([0-9]+)\}$/)[1];
        this.acceptOrRejectTrade(tradeId, alert.id, event);
      }

      // 4. Give info on a finished trade
      if (/^Trade completed/.test(alert.chat)){
        let tradeId = +alert.chat.match(/\{([0-9]+)\}$/)[1];
        this.describeTrade(tradeId, alert.id, event);
      }
    }
  }

  respondToInvite(inviteId, alertId, ev){
    this.tradeService.getInvite(this.player.id, inviteId, true).then( (_invite: Invite) => {
      let invite = new Invite(0);
      invite.init(_invite);

      this.playerService.getPlayer(invite.invitee).then( (otherPlayer: Player) => {
        let popover = this.popoverCtrl.create(InvitePage, {
          player: this.player,
          otherPlayer: otherPlayer,
          invite: invite,
          alert: alertId
        });

        popover.present();
      });
    });
  }

  respondToTradeRequest(tradeId, alertId, ev){
    //noinspection TypeScriptUnresolvedFunction
    this.tradeService.getTrade(this.player.id, tradeId, true).then( (_trade: Trade) => {
      let trade = new Trade(0);
      trade.init(_trade);

      this.playerService.getPlayer(trade.offerer).then( (otherPlayer: Player) => {

        let popover = this.popoverCtrl.create(TradePage, {
          player: this.player,
          otherPlayer: otherPlayer,
          trade: trade,
          alert: alertId
        }, {cssClass: 'poopover'});

        popover.present({ev});
      });
    });
  }

  acceptOrRejectTrade(tradeId, alertId, ev){
    //noinspection TypeScriptUnresolvedFunction
    this.tradeService.getTrade(this.player.id, tradeId, true).then( (_trade: Trade) => {
      let trade = new Trade(0);
      trade.init(_trade);

      this.playerService.getPlayer(trade.offeree).then( (otherPlayer: Player) => {

        let popover = this.popoverCtrl.create(TradePage, {
          player: this.player,
          otherPlayer: otherPlayer,
          trade: trade,
          alert: alertId
        }, {cssClass: 'poopover'});

        popover.present({ev});
      });
    });
  }

  describeTrade(tradeId, alertId, ev){
    //noinspection TypeScriptUnresolvedFunction
    this.tradeService.getTrade(this.player.id, tradeId, true).then( (_trade: Trade) => {
      let trade = new Trade(0);
      trade.init(_trade);

      this.playerService.getPlayer(trade.offeree).then( (otherPlayer: Player) => {

        let popover = this.popoverCtrl.create(TradePage, {
          player: this.player,
          otherPlayer: otherPlayer,
          trade: trade,
          alert: alertId
        }, {cssClass: 'poopover'});

        popover.present({ev});
      });
    });
  }

  describeInvite(inviteId, alertId, ev){
    //noinspection TypeScriptUnresolvedFunction
    this.tradeService.getInvite(this.player.id, inviteId, true).then( (_invite: Invite) => {
      let invite = new Invite(0);
      invite.init(_invite);

      this.playerService.getPlayer(invite.invitee).then( (otherPlayer: Player) => {

        let popover = this.popoverCtrl.create(InvitePage, {
          player: this.player,
          otherPlayer: otherPlayer,
          invite: invite,
          alert: alertId
        }, {cssClass: 'poopover'});

        popover.present({ev});
      });
    });
  }

  cleanedMsg(chat){
    if (chat.poster && chat.poster != 0)
      return chat.chat;

    return chat.chat.replace(/ *\{[0-9]+\}$/, '');
  }
}
