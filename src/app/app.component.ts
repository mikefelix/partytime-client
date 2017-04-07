import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar, Splashscreen } from 'ionic-native';
import { QuestService } from "../providers/QuestService";

import { TabsPage } from '../pages/tabs/tabs';
import { ChatService } from "../providers/ChatService";
import {LocalState} from "../providers/localState";
import {LoginService} from "../providers/LoginService";
import {TradeService} from "../providers/TradeService";
import {PlayerService} from "../providers/PlayerService";


@Component({
  templateUrl: 'app.html',
  providers: [QuestService, ChatService, LocalState, LoginService, TradeService, PlayerService]
})
export class MyApp {
  rootPage = TabsPage;

  constructor(platform: Platform) {
    //noinspection TypeScriptUnresolvedFunction
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      StatusBar.styleDefault();
      Splashscreen.hide();
    });
  }
}
