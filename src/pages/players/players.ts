import { Component, OnInit } from '@angular/core';

import {QuestService} from "../../providers/QuestService";
import {Player} from "../../providers/Player";
import {AlertController} from "ionic-angular/index";
import { PopoverController } from 'ionic-angular';
import {TradePage} from "../trade/trade";
import {PlayerService} from "../../providers/PlayerService";
import {LoginService} from "../../providers/LoginService";

@Component({
  selector: 'page-players',
  templateUrl: 'players.html'
})
export class PlayersPage implements OnInit {
  started: boolean;
  players: Player[];
  player: Player;

  constructor(private playerService: PlayerService, private questService: QuestService, private popoverCtrl: PopoverController,
              private alertCtrl: AlertController, private loginService: LoginService) {
    this.players = [];
    this.player = {
        id: +localStorage.getItem("player"),
        name: "",
        alias: "",
        items: [],
        powers: []
      };
  }

  ngOnInit() {
    let playerId = this.loginService.getId();
    if (!playerId)
      return;

    //noinspection TypeScriptUnresolvedFunction
    this.playerService.getPlayersExcept(playerId).then(p => {
        this.players = p;
    });

    //noinspection TypeScriptUnresolvedFunction
    this.playerService.getPlayer(playerId).then((p: Player) => {
        this.player = p;
    });

    this.questService.gameIsStarted().then( (started: boolean) => {
      this.started = started;
    });

  }

  describeReq(req){
    this.alertCtrl.create({
      title: req.name,
      subTitle: req.description,
      buttons: ['Dismiss']
    }).present();
  }

  invite(fellow){
    this.alertCtrl.create({
      title: 'Call to action',
      subTitle: `Invite ${fellow} to help you on your quest?`,
      buttons: [{
        text: 'No',
        role: 'cancel'
      },{
        text: 'Yes!',
        handler: data => {
          this.proposeJoin(fellow);
        }
      }]
    }).present();
  }

  proposeTrade(req, fellow, offer){

  }

  proposeJoin(fellow){

  }

  initiateTrade(otherPlayer, ev){
    let popover = this.popoverCtrl.create(TradePage, {
      player: this.player,
      otherPlayer: otherPlayer,
      trade: 0
    });

    popover.present({
      // ev: ev
    });
  }
}
