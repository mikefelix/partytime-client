import { Component, OnInit } from '@angular/core';

import { QuestService } from "../../providers/QuestService";
import { Quest } from "../../providers/Quest";
import { AlertController } from 'ionic-angular';
import {LoginService} from "../../providers/LoginService";
import {Player} from "../../providers/Player";
import {PlayerService} from "../../providers/PlayerService";

@Component({
  selector: 'page-quest',
  templateUrl: 'quest.html'
})
export class QuestPage implements OnInit {
  started: boolean;
  quest: Quest;
  sidequest: Quest;
  player: Player;
  sidequestAlly: string;
  errorMessage: string;

  constructor(private questService: QuestService, private playerService: PlayerService,
              private loginService: LoginService, public alertCtrl: AlertController) {
    this.quest = {
      id: 0,
      master: 0,
      name: '',
      description: '',
      items: [],
      powers: []
    };

    this.sidequest = {
      id: 0,
      master: 0,
      name: '',
      description: '',
      items: [],
      powers: []
    };

    this.player = {
      id: 0,
      name: "",
      alias: "",
      items: [],
      powers: []
    };

    this.sidequestAlly = "your ally";
  }

  ngOnInit() {
    let player = this.loginService.getId();
    if (!player)
      throw 'No player ID found in localStorage.';

    this.player.id = player;
    this.refreshPlayer();

    this.questService.gameIsStarted().then( (started: boolean) => {
      this.started = started;
      if (started) {
        this.refreshQuest();
        this.refreshSidequest();
      }
    });

  }

  refreshPlayer() {
    //noinspection TypeScriptUnresolvedFunction
    this.playerService.getPlayer(this.player.id).then( (p: Player) => {
      this.player = p;
    });
  }

  refreshQuest(){
    //noinspection TypeScriptUnresolvedFunction
    this.questService.getQuestForPlayer(this.player.id).then( (q: Quest) => {
      this.quest = q;
    })
  }

  refreshSidequest(){
    //noinspection TypeScriptUnresolvedFunction
    this.questService.getSidequestForPlayer(this.player.id).then((q: Quest) => {
      if (q.id == 0){
        this.sidequest = {
          id: 0,
          master: 0,
          name: '',
          description: '',
          items: [],
          powers: []
        };
      }
      else {
        this.sidequest = q;
        this.playerService.getPlayer(q.master).then((p: Player) => {
          this.sidequestAlly = p.alias;
        })
      }
    })
  }

  describeReq(req){
    this.alertCtrl.create({
      title: req.name,
      subTitle: req.description,
      buttons: ['Dismiss']
    }).present();
  }

  removeLogin(){
    localStorage.removeItem("player");
  }
}
