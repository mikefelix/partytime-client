import {Component, OnInit} from '@angular/core';

import { QuestPage } from '../quest/quest';
import { PlayersPage } from '../players/players';
import { ChatPage } from "../chat/chat";
import {AlertController} from "ionic-angular/index";
import {LoginService} from "../../providers/LoginService";

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage implements OnInit {
  // this tells the tabs component which Pages
  // should be each tab's root Page
  tab1Root: any = QuestPage;
  tab2Root: any = PlayersPage;
  tab3Root: any = ChatPage;

  chatNum: number = 1;

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
