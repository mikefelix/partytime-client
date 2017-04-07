import { Component, OnInit } from '@angular/core';

import {QuestService} from "../../providers/QuestService";
import {Player} from "../../providers/Player";
import {AlertController} from "ionic-angular/index";
import { PopoverController } from 'ionic-angular';
import {TradePage} from "../trade/trade";
import {PlayerService} from "../../providers/PlayerService";

@Component({
  selector: 'page-players',
  templateUrl: 'players.html'
})
export class PlayersPage implements OnInit {
  players: Player[];
  player: Player;

  constructor(private playerService: PlayerService, private popoverCtrl: PopoverController,
              private alertCtrl: AlertController) {
    this.players = [];
    this.player = {
        id: 1,
        name: "",
        alias: "",
        items: [],
        powers: []
      };
  }

  ngOnInit() {
    //noinspection TypeScriptUnresolvedFunction
    this.playerService.getPlayersExcept(this.player.id).then(p => {
        this.players = p;
    });

    //noinspection TypeScriptUnresolvedFunction
    this.playerService.getPlayer(this.player.id).then((p: Player) => {
        this.player = p;
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
