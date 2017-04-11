import {Component, OnInit} from "@angular/core";
import {ViewController, NavParams} from "ionic-angular/index";
import {Player} from "../../providers/Player";
import {Trade} from "../../providers/Trade";
import {TradeService} from "../../providers/TradeService";
import {Http, Response} from "@angular/http";
import { AlertController } from 'ionic-angular';
import {ChatService} from "../../providers/ChatService";
import {LoginService} from "../../providers/LoginService";

@Component({
  templateUrl: 'trade.html',
  providers: [TradeService, ChatService, LoginService],
})
export class TradePage implements OnInit {
  player: Player;
  otherPlayer: Player;
  tradeId: number;
  trade: Trade;
  alert: number;
  options: Array<Object>;
  option: string = "+1";
  message: String;
  mask: boolean = false;

  constructor(private params: NavParams, public viewCtrl: ViewController, public tradeService: TradeService,
              public alertCtrl: AlertController, public chatService: ChatService) {
    // this.options;// = [];
    this.player = params.get('player');
    this.otherPlayer = params.get('otherPlayer');

    this.tradeId = params.get('tradeId') as number;
    this.alert = params.get('alert') as number;
    this.trade = params.get('trade') as Trade;
    if (!this.trade)
      this.trade = new Trade(0);
  }

  ngOnInit(){
    if (this.tradeId && this.tradeId > 0){
      //noinspection TypeScriptUnresolvedFunction
      this.tradeService.getTrade(this.player.id, this.trade.id).then(trade => {
        this.trade = trade;
      })
    }

    //noinspection TypeScriptUnresolvedFunction
    this.tradeService.getOfferOptions(this.player).then(options => {
      this.options = options;
    });
  }

  cancelTrade(){
    if (!this.trade.creating()){
      //noinspection TypeScriptUnresolvedFunction
      this.tradeService.rejectTrade(this.trade).then(msg => {
        this.message = msg;
        if (this.alert)
          this.chatService.markAlertRead(this.alert);
      });
    }

    this.mask = true;
    this.close();
  }

  canAct(){
    if (!this.trade)
      return false;

    if (this.trade.creating()){
      return true;
    }
    else if (this.trade.responding()){
      return this.player.id == this.trade.offeree;
    }
    else if (this.trade.accepting()){
      return this.player.id == this.trade.offerer;
    }
    else {
      return false;
    }
  }

  proposeTrade(){
    let trade = this.trade;

    if (trade.creating()){
      trade.offerer = this.player.id;
      trade.offeree = this.otherPlayer.id;

      if (this.isItem(this.option))
        trade.offererItem = +this.option;
      else
        trade.offererOther = this.option;

      //noinspection TypeScriptUnresolvedFunction
      this.tradeService.offerTrade(trade).then(msg => {
        this.message = msg;
        if (this.alert) {
          console.log('clear alert ' + this.alert);
          this.chatService.markAlertRead(this.alert);
        }
        else
          console.log('no alert to clear.');
      });

      this.mask = true;
      // this.close();
    }
    else if (trade.responding()){
      console.log('Responding to trade ' + trade.id);
      if (this.isItem(this.option))
        trade.offereeItem = +this.option;
      else
        trade.offereeOther = this.option;

      //noinspection TypeScriptUnresolvedFunction
      this.tradeService.counterofferTrade(trade).then(msg => {
        this.message = msg;
        if (this.alert) {
          console.log('clear alert ' + this.alert);
          this.chatService.markAlertRead(this.alert);
        }
        else
          console.log('no alert to clear.');
      });

      this.mask = true;
      // this.close();
    }
    else if (trade.accepting()){
      //noinspection TypeScriptUnresolvedFunction
      this.tradeService.acceptTrade(trade).then(msg => {
        this.message = msg;
        if (this.alert) {
          console.log('clear alert ' + this.alert);
          this.chatService.markAlertRead(this.alert);
        }
        else
          console.log('no alert to clear.');
      });

      this.mask = true;
      // this.close();
    }
  }

  isItem(thing){
    return /^[0-9]+$/.test(thing);
  }

  close() {
    if (this.trade.accepted() || this.trade.rejected()){
      this.chatService.markAlertRead(this.alert);
    }

    this.viewCtrl.dismiss();
  }

  describeReq(req){
     this.alertCtrl.create({
       title: req.name,
       subTitle: req.description,
       buttons: ['Dismiss']
     }).present();
   }
}
