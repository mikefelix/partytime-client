import {Component, OnInit} from '@angular/core';

import { QuestPage } from '../quest/quest';
import { PlayersPage } from '../players/players';
import { ChatPage } from "../chat/chat";
import {AlertController} from "ionic-angular/index";
import {LoginService} from "../../providers/LoginService";
import {AlertsPage} from "../alerts/alerts";
import {ChatService} from "../../providers/ChatService";
import {Chat} from "../../providers/Chat";
import {PlayerService} from "../../providers/PlayerService";

@Component({
  templateUrl: 'tabs.html',
  providers: [ChatService, LoginService, PlayerService]
})
export class TabsPage implements OnInit {
  // this tells the tabs component which Pages
  // should be each tab's root Page
  tab1Root: any = QuestPage;
  tab2Root: any = PlayersPage;
  tab3Root: any = ChatPage;
  tab4Root: any = AlertsPage;

  alertNum: number;

  constructor(private loginService: LoginService, private alertCtrl: AlertController, public chatService: ChatService,
              private playerService: PlayerService) {
  }

  ngOnInit(){
    // this.checkForAlerts(this.chatService, player);
    this.chatService.alertsSubject.subscribe(
      alerts => {
        this.alertNum = alerts && alerts.length > 0 ? alerts.length : undefined;
      }
    );

    this.chatService.wakeUp();
    this.playerService.wakeUp();
  }

/*
  checkForAlerts(svc, player){
    svc.getAlerts(player).then( (alerts: Chat[]) => {
      this.alertNum = alerts && alerts.length > 0 ? alerts.length : undefined;
      setTimeout(() => this.checkForAlerts(svc, player), 5000);
    });
  }
*/

  showLogin(){
    let alert = this.alertCtrl.create({
      title: 'Login',
      enableBackdropDismiss: false,
      message: 'Please log in.',
      inputs: [
        {
          name: 'username',
          placeholder: 'Username'
        },
        {
          name: 'password',
          placeholder: 'Password',
          type: 'password'
        }
      ],
      buttons: [
        {
          text: 'Login',
          handler: data => {
            //noinspection TypeScriptUnresolvedFunction
/*
            this.loginService.login(data.username, data.password).then( (result) => {
              console.log('result: ' + result);
              if (result){

              }
            });
*/
            return false;
          }
        }
      ]
    });

    alert.present();
  }
}
