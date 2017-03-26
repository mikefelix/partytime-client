import { Component, OnInit } from '@angular/core';

import {ChatService} from "../../providers/ChatService";

@Component({
  selector: 'page-chat',
  templateUrl: 'chat.html'
})
export class ChatPage implements OnInit {
  chats: Array<String>;

  constructor(public chatService: ChatService) {
    this.chats = ["Hi", "This game is awesome!", "GTFO"]
  }

  ngOnInit():void {

  }
}
