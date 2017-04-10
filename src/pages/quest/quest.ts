import { Component, OnInit } from '@angular/core';

import { QuestService } from "../../providers/QuestService";
import { Quest } from "../../providers/Quest";
import { AlertController } from 'ionic-angular';
import {LoginService} from "../../providers/LoginService";
import {Player} from "../../providers/Player";
import {PlayerService} from "../../providers/PlayerService";
import {Item} from "../../providers/Item";
import {Power} from "../../providers/Power";

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

  describeItem(req: Item){
    this.playerService.getPlayer(req.rumors && req.rumors.length >= 1 ? req.rumors[0] : 0).then( (rumor1: Player) =>{
      this.playerService.getPlayer(req.rumors && req.rumors.length >= 2 ? req.rumors[1] : 0).then( (rumor2: Player) =>{
        let rumored: string = rumor1 ? rumor1.alias : '';
        if (rumor2) rumored += ', ' + rumor2.alias;

        this.alertCtrl.create({
          title: req.name,
          subTitle: rumored ? `${req.description}\nRumored possessors: ${rumored}` : req.description,
          buttons: ['Dismiss']
        }).present();
      });
    });
  }

  describePower(req: Power){
    this.playerService.getPlayer(req.rumors && req.rumors.length >= 1 ? req.rumors[0] : 0).then( (rumor1: Player) =>{
      this.playerService.getPlayer(req.rumors && req.rumors.length >= 2 ? req.rumors[1] : 0).then( (rumor2: Player) =>{
        let rumored: string = rumor1 ? rumor1.alias : '';
        if (rumor2) rumored += ', ' + rumor2.alias;

        this.alertCtrl.create({
          title: req.name,
          subTitle: rumored ? `${req.description}\nRumored possessors: ${rumored}` : req.description,
          buttons: ['Dismiss']
        }).present();
      });
    });
  }

  removeLogin(){
    localStorage.removeItem("player");
  }

  completeQuest(quest: Quest){
    this.questService.completeQuest(quest).then((newQuest: Quest) => {
      this.quest = newQuest;
    });
  }

  maximumCompletionReward(quest: Quest) {
    let itemsNeeded = quest.items.length;
    let powersNeeded = quest.powers.length;
    let itemsFound = quest.items.filter(it => it.found).length;
    let powersFound = quest.powers.filter(it => it.found).length;
    let reqsNeeded = itemsNeeded + powersNeeded;
    let reqsFound = itemsFound + powersFound;
    let base = reqsFound * 10;

    if (reqsNeeded >= 5) {
        return base + 40;
    }
    else if (reqsNeeded == 4) {
        return base + 30;
    }
    else {
        return base + 20;
    }
  }

  currentCompletionReward(quest: Quest){
    let itemsNeeded = quest.items.length;
    let powersNeeded = quest.powers.length;
    let itemsFound = quest.items.filter(it => it.found).length;
    let powersFound = quest.powers.filter(it => it.found).length;
    let missingItems = itemsNeeded - itemsFound;
    let missingPowers = powersNeeded - powersFound;
    let missingReqs = missingItems + missingPowers;
    let reqsNeeded = itemsNeeded + powersNeeded;
    let reqsFound = itemsFound + powersFound;
    let base = reqsFound * 10;

    if (reqsNeeded >= 5) {
      if (missingReqs == 0) {
        return base + 40;
      }
      else if (missingReqs == 1) {
        return base + 15;
      }
      else if (missingReqs == 2) {
        return base;
      }
      else {
        return 0;
      }
    }
    else if (reqsNeeded == 4) {
      if (missingReqs == 0) {
        return base + 30;
      }
      else if (missingReqs == 1) {
        return base + 10;
      }
      else {
        return 0;
      }
    }
    else {
      if (missingReqs == 0) {
        return base + 20;
      }
      else {
        return 0;
      }
    }
  }
}
