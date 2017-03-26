import { Component, OnInit } from '@angular/core';

import { QuestService } from "../../providers/QuestService";
import { Quest } from "../../providers/Quest";
import { AlertController } from 'ionic-angular';
import {LoginService} from "../../providers/LoginService";
import {Player} from "../../providers/Player";
import {Http} from "@angular/http";

@Component({
  selector: 'page-quest',
  templateUrl: 'quest.html'
})
export class QuestPage implements OnInit {
  quest: Quest;
  sidequest: Quest;
  player: Player;

  errorMessage: string;

  constructor(private questService: QuestService, private loginService: LoginService, public alertCtrl: AlertController) {
    this.quest = {
      id: 0,
      name: '',
      description: '',
      items: [],
      powers: []
    };

    this.sidequest = {
      id: 0,
      name: '',
      description: '',
      items: [],
      powers: []
    };

    this.player = {
      id: 1,
      name: "Brandon",
      alias: "Mr. Buttkix",
      items: [],
      powers: []
    };
  }

  ngOnInit() {
    this.refreshPlayer();
    this.refreshQuest();
    this.refreshSidequest();
  }

  refreshPlayer() {
    //noinspection TypeScriptUnresolvedFunction
    this.loginService.getPlayer(this.player.id).then(p => {
      this.player = p;
    });
  }

  refreshQuest(){
    //noinspection TypeScriptUnresolvedFunction
    this.questService.getQuestForPlayer(this.player.id).then(q => {
      this.quest = q;
    })
  }

  refreshSidequest(){
    //noinspection TypeScriptUnresolvedFunction
    this.questService.getSidequestForPlayer(this.player.id).then(q => {
      this.sidequest = q;
    })
  }

  describePower(power){
    this.alertCtrl.create({
      title: power.name,
      subTitle: power.description,
      buttons: ['Dismiss']
    }).present();
  }

  describeItem(item){
    this.alertCtrl.create({
      title: item.name,
      subTitle: item.description,
      buttons: ['Dismiss']
    }).present();
  }
}
