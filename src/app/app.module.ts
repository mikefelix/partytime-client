import { NgModule, ErrorHandler } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';
import { AboutPage } from '../pages/about/about';
import { ChatPage } from '../pages/chat/chat';
import { AlertsPage } from '../pages/alerts/alerts';
import { QuestPage } from '../pages/quest/quest';
import { PlayersPage } from '../pages/players/players';
import { TabsPage } from '../pages/tabs/tabs';
import {TradePage} from "../pages/trade/trade";
import {BlankPage} from "../pages/blank/blank";
import {InvitePage} from "../pages/invite/invite";

@NgModule({
  declarations: [
    MyApp,
    AboutPage,
    ChatPage,
    QuestPage,
    PlayersPage,
    TabsPage,
    TradePage,
    BlankPage,
    AlertsPage,
    InvitePage
  ],
  imports: [
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    AboutPage,
    ChatPage,
    PlayersPage,
    QuestPage,
    TabsPage,
    TradePage,
    BlankPage,
    AlertsPage,
    InvitePage
  ],
  providers: [{provide: ErrorHandler, useClass: IonicErrorHandler}]
})
export class AppModule {}
