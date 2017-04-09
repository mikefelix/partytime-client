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

  ngOnInit():void {
    this.playerService.getPlayer(this.loginService.getId()).then((player: Player) => {
      this.player = player;
      this.chatService.getAlerts(this.player.id).then((alerts: Chat[]) => {
        this.alerts = alerts;
      });
    });
  }

  handleClick(chat: Chat){
    if (!chat.poster && chat.poster == 0){
      // 1. Accept a join proposal


      // 2. Accept a trade invitation
      if (/^Trade request/.test(chat.chat)){
        let tradeId = +chat.chat.match(/\{([0-9]+)\}$/)[1];
        this.respondToTradeRequest(tradeId);
      }

    }
  }

  respondToTradeRequest(tradeId){
    //noinspection TypeScriptUnresolvedFunction
    this.tradeService.getTrade(this.player.id, tradeId, true).then( (trade: Trade) => {
      let otherPlayer = this.playerService.getPlayer(trade.offerer);

      let popover = this.popoverCtrl.create(TradePage, {
        player: this.player,
        otherPlayer: otherPlayer,
        trade: trade
      });

      popover.present({
        // ev: ev
      });
    });
  }

  cleanedMsg(chat){
    if (chat.poster && chat.poster != 0)
      return chat.chat;

    return chat.chat.replace(/ *\{[0-9]+\}$/, '');
  }
}
