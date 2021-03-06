import { Component, ViewChild, OnInit } from '@angular/core';
import { Content } from 'ionic-angular';import {ChatService} from "../../providers/ChatService";
import {Player} from "../../providers/Player";
import {Chat} from "../../providers/Chat";
import {PlayerService} from "../../providers/PlayerService";
import {LoginService} from "../../providers/LoginService";

@Component({
  selector: 'page-chat',
  templateUrl: 'chat.html'
})
export class ChatPage implements OnInit {
  chats: Chat[];
  player: Player;
  enteredChat: string;
  @ViewChild(Content) content: Content;

  constructor(public chatService: ChatService, private playerService: PlayerService, private loginService: LoginService) {
    this.chats = [];
  }

  ngOnInit():void {
    this.playerService.getPlayer(this.loginService.getId()).then((player: Player) => {
      this.player = player;
      this.pollForChats(this.chatService, this.player);
    });

    // viewCtrl.didEnter.subscribe( () => {
    //
    // });
  }

  scrollToBottom(){
    this.content.scrollToBottom();
  }

  pollForChats(svc, player, reschedule: Boolean = true){
    //noinspection TypeScriptUnresolvedFunction
    svc.getLatest(player).then((data) => {
      this.chats = data;
    });

    if (reschedule) {
      setTimeout(() => this.pollForChats(svc, player), 10000);
    }
  }

  postChat(){
    //noinspection TypeScriptUnresolvedFunction
    let body = {
      "game": 1,
      "poster": this.player.id,
      "chat": this.enteredChat
    };

    //noinspection TypeScriptUnresolvedFunction
    this.chatService.postChat(body).then(() => {
      this.enteredChat = '';
      this.pollForChats(this.chatService, this.player, false);
    });
  }

  cleanedMsg(chat){
    if (chat.poster && chat.poster != 0)
      return chat.chat;

    return chat.chat.replace(/ *\{[0-9]+\}$/, '');
  }
}
