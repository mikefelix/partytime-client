import { Component, OnInit } from '@angular/core';

import {QuestService} from "../../providers/QuestService";
import {Player} from "../../providers/Player";

@Component({
  selector: 'page-players',
  templateUrl: 'players.html'
})
export class PlayersPage implements OnInit {
  players: Player[];

  constructor(private questService: QuestService) {
    this.players = []
  }

  ngOnInit():void {
  }

}
