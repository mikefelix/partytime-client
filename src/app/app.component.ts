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
import {AboutPage} from "../pages/about/about";
import {BlankPage} from "../pages/blank/blank";


@Component({
  templateUrl: 'app.html',
  providers: [QuestService, ChatService, LocalState, LoginService, TradeService, PlayerService]
})
export class MyApp {
  rootPage = BlankPage;

  constructor(platform: Platform) {
    //noinspection TypeScriptUnresolvedFunction
    platform.ready().then(() => {
      StatusBar.styleDefault();
      Splashscreen.hide();

      if (!localStorage.getItem("player"))
        this.rootPage = AboutPage;
      else
        this.rootPage = TabsPage;
    });
  }
}
