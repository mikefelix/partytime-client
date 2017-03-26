import {Component, OnInit} from '@angular/core';

import { QuestPage } from '../quest/quest';
import { PlayersPage } from '../players/players';
import { ChatPage } from "../chat/chat";
import {AlertController} from "ionic-angular/index";
import {LocalState} from "../../providers/localState";
import {LoginService} from "../../providers/LoginService";

@Component({
  template: `
  <ion-tabs>
    <ion-tab [root]="tab1Root" tabTitle="Me" tabIcon="car"></ion-tab>
    <ion-tab [root]="tab2Root" tabTitle="Them" tabIcon="bulb"></ion-tab>
    <ion-tab [root]="tab3Root" tabTitle="Chat" tabIcon="sunny"></ion-tab>
  </ion-tabs>`
})
export class TabsPage implements OnInit {
  // this tells the tabs component which Pages
  // should be each tab's root Page
  tab1Root: any = QuestPage;
  tab2Root: any = PlayersPage;
  tab3Root: any = ChatPage;

  constructor(private loginService: LoginService, private alertCtrl: AlertController) {
  }

  ngOnInit(){
  }

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
            this.loginService.login(data.username, data.password).then( (result) => {
              console.log('result: ' + result);
              if (result){

              }
            });
            return false;
          }
        }
      ]
    });

    alert.present();
  }
}
