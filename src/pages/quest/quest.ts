import {Component, OnInit} from "@angular/core";
import {QuestService} from "../../providers/QuestService";
import {Quest} from "../../providers/Quest";
import {AlertController} from "ionic-angular";
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
  questReward: number;
  questRewardMax: number;

  sidequest: Quest;
  sidequestReward: number;
  sidequestRewardMax: number;
  sidequestMaster: string;
  allies: string[];
  player: Player;
  selectedSeg = "hero";
  errorMessage: string;

  constructor(private questService: QuestService, private playerService: PlayerService,
              private loginService: LoginService, public alertCtrl: AlertController) {
    this.quest = new Quest(0);
    this.sidequest = new Quest(0);
    this.player = new Player(0);
    this.sidequestMaster = "your ally";
    this.allies = [];

    this.questService.questSubject.subscribe(
      quest => {
        console.log('refreshed with quest ' + quest.id);
        this.quest = quest;
        this.computeQuestReward();

        if (quest.allies){
          for (let i = 0; i < quest.allies.length; i++){
            let ally = quest.allies[i];
            this.playerService.getPlayer(ally).then((p: Player) => {
              this.allies[i] = p.alias;
            });
          }
        }
      }
    );

    this.questService.sidequestSubject.subscribe(
      quest => {
        console.log('refreshed with sidequest ' + quest.id);
        if (quest.id == 0){
          this.sidequest = new Quest(0);
          this.computeSidequestReward();
        }
        else {
          this.sidequest = quest;
          this.computeSidequestReward();
          this.playerService.getPlayer(quest.master).then((p: Player) => {
            if (p)
              this.sidequestMaster = p.alias;
          });
        }
      }
    );

    this.playerService.currentPlayerSubject.subscribe(
      player => {
        if (player.id == 0){
          this.player = new Player(0);
        }
        else {
          this.player = player;
        }
      }
    )
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
    this.playerService.refreshCurrentPlayer(this.player.id).then( (p: Player) => {
      // this.player = p;
    });
  }

  refreshQuest(){
    //noinspection TypeScriptUnresolvedFunction
    this.questService.refreshQuest(this.player.id).then( (q: Quest) => {
      // this.quest = q;
    })
  }

  refreshSidequest(){
    //noinspection TypeScriptUnresolvedFunction
    this.questService.refreshSidequest(this.player.id).then((q: Quest) => {
/*
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
          this.sidequestMaster = p.alias;
        })
      }
*/
    })
  }

  rumoredItemDesc(req: Item, rumored: string) {
    if (Math.random() < 0.5)
      return `${req.description}\n Rumor has it you might get this from ${rumored}.`;
    else
      return `${req.description}\n Possible owners: ${rumored}.`;
  }

  describeItem(req: Item, withRumors: boolean = false){
    this.playerService.getPlayer(req.rumors && req.rumors.length >= 1 ? req.rumors[0] : 0).then( (rumor1: Player) =>{
      this.playerService.getPlayer(req.rumors && req.rumors.length >= 2 ? req.rumors[1] : 0).then( (rumor2: Player) =>{
        let desc;
        if (withRumors && (rumor1 || rumor2)) {
          let rumored = rumor1.alias + ' or ' + rumor2.alias;
          desc = this.rumoredItemDesc(req, rumored);
        }
        else {
          desc = req.description;
        }

        this.alertCtrl.create({
          title: req.name,
          subTitle: desc,
          buttons: ['Dismiss']
        }).present();
      });
    });
  }

  rumoredPowerDesc(req: Power, rumored: string) {
    if (Math.random() < 0.5)
      return `${req.description}\n To find this power, talk to ${rumored}.`;
    else
      return `${req.description}\n ${rumored} might have this power.`;
  }

  describePower(req: Power, withRumors: boolean = false){
    this.playerService.getPlayer(req.rumors && req.rumors.length >= 1 ? req.rumors[0] : 0).then( (rumor1: Player) =>{
      this.playerService.getPlayer(req.rumors && req.rumors.length >= 2 ? req.rumors[1] : 0).then( (rumor2: Player) =>{
        let desc;
        if (withRumors && (rumor1 || rumor2)) {
          let rumored = rumor1.alias + ' or ' + rumor2.alias;
          desc = this.rumoredPowerDesc(req, rumored);
        }
        else {
          desc = req.description;
        }

        this.alertCtrl.create({
          title: req.name,
          subTitle: desc,
          buttons: ['Dismiss']
        }).present();
      });
    });
  }

  removeLogin(){
    localStorage.removeItem("player");
  }

  completeQuest(quest: Quest){
    let itemsNeeded = quest.items.length;
    let powersNeeded = quest.powers.length;
    let itemsFound = quest.items.filter(it => it.found).length;
    let powersFound = quest.powers.filter(it => it.found).length;
    let reqsNeeded = itemsNeeded + powersNeeded;
    let reqsFound = itemsFound + powersFound;
    let title, desc;

    if (quest == this.sidequest){
      title = 'Leave quest';
      desc = 'Leave this quest?';
    }
    else if (this.currentCompletionReward(quest) <= 0){
      title = 'Abandon quest';
      desc = 'Abandon this quest for -5 points and get a new quest?';
    }
    else if (reqsNeeded > reqsFound){
      title = 'Complete quest';
      desc = 'Not quite there! Complete this quest for partial points and get a new one?';
    }
    else {
      title = 'Complete quest';
      desc = 'You have gathered all the requirements. Good job! Complete this quest?';
    }

    this.alertCtrl.create({
      title: title,
      subTitle: desc,
      buttons: [
        {
          text: 'Ok',
          handler: () => {
            if (quest == this.sidequest){
              console.log('leaving sidequest ' + quest.id);
              this.questService.leaveSidequest(this.player.id).then((newQuest: Quest) => {
                this.sidequest = newQuest;
              });
            }
            else {
              this.questService.completeQuest(this.player.id).then((newQuest: Quest) => {
                this.quest = newQuest;
                this.refreshPlayer();
              });
            }
          }
        },
        {
          text: 'Cancel',
          handler: () => {
          }
        }
      ]
    }).present();

  }

  maximumCompletionReward(quest: Quest, side: Boolean = false) {
    if (!quest.items || !quest.powers)
      return 0;

    let itemsNeeded = quest.items.length;
    let powersNeeded = quest.powers.length;
    let itemsFound = quest.items.filter(it => it.found).length;
    let powersFound = quest.powers.filter(it => it.found).length;
    let reqsNeeded = itemsNeeded + powersNeeded;
    let reqsFound = itemsFound + powersFound;
    let base = reqsNeeded * 10;

    if (side)
      return base;

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

  currentCompletionReward(quest: Quest, side: Boolean = false){
    if (!quest.items || !quest.powers)
      return 0;

    let itemsNeeded = quest.items.length;
    let powersNeeded = quest.powers.length;
    let itemsFound = quest.items.filter(it => it.found).length;
    let powersFound = quest.powers.filter(it => it.found).length;
    let missingItems = itemsNeeded - itemsFound;
    let missingPowers = powersNeeded - powersFound;
    let missingReqs = missingItems + missingPowers;
    let reqsNeeded = itemsNeeded + powersNeeded;
    let reqsFound = itemsFound + powersFound;

    if (reqsFound == 0)
      return -5;

    let base = reqsFound * 10;

    if (side)
      return base;

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

  revealHero(player: number){
    this.playerService.getPlayer(player).then((p: Player) => {
      this.alertCtrl.create({
        title: p.name,
        subTitle: `Sources reveal that the secret identity of ${p.alias} is: ${p.name}!`,
        buttons: ['Dismiss']
      }).present();
    });
  }

  computeQuestReward(){
    this.questReward = this.currentCompletionReward(this.quest);
    this.questRewardMax = this.maximumCompletionReward(this.quest);
  }

  computeSidequestReward(){
    this.sidequestReward = this.currentCompletionReward(this.sidequest);
    this.sidequestRewardMax = this.maximumCompletionReward(this.sidequest);
  }

}
