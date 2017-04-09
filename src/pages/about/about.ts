import { Component } from '@angular/core';

import { NavController } from 'ionic-angular';
import {PlayerService} from "../../providers/PlayerService";
import {Player} from "../../providers/Player";

@Component({
  selector: 'page-about',
  templateUrl: 'about.html'
})
export class AboutPage {
  message: string = "";
  playerName: string;
  heroName: string;

  constructor(public navCtrl: NavController, private playerService: PlayerService) {
  }

  login(){
    if (!this.formValid()){
      this.message = "Please enter both fields.";
      return;
    }

    //noinspection TypeScriptUnresolvedFunction
    this.playerService.createPlayer(this.playerName, this.heroName).then( (player: Player) => {
      localStorage.setItem("player", player.id.toString());
      this.message = `Welcome, ${this.heroName}! Please reload the page to begin. ${localStorage.getItem("player")}`;
    });
  }

  formValid(){
    return this.playerName && this.heroName;
  }
}
