import {Component, OnInit} from "@angular/core";
import {ViewController, NavParams} from "ionic-angular/index";
import {Player} from "../../providers/Player";
import {Trade} from "../../providers/Trade";
import {TradeService} from "../../providers/TradeService";
import {Http, Response} from "@angular/http";
import { AlertController } from 'ionic-angular';
import {ChatService} from "../../providers/ChatService";
import {Invite} from "../../providers/Invite";
import {PlayerService} from "../../providers/PlayerService";
import {LoginService} from "../../providers/LoginService";

@Component({
  templateUrl: 'invite.html',
  providers: [TradeService, ChatService, LoginService],
})
export class InvitePage implements OnInit {
  player: Player;
  otherPlayer: Player;
  alert: number;
  message: String;
  invite: Invite;
  // invitee: Player;
  // inviter: Player;
  inviteId: number;
  mask: boolean = false;

  constructor(private params: NavParams, public viewCtrl: ViewController, public tradeService: TradeService,
              public chatService: ChatService) {
    this.player = params.get('player') as Player;
    this.otherPlayer = params.get('otherPlayer') as Player;
    this.alert = params.get('alert') as number;
    this.inviteId = params.get('inviteId') as number;
    this.invite = params.get('invite') as Invite;
    if (!this.invite)
      this.invite = new Invite(0);
  }

  ngOnInit(){
    if (this.inviteId && this.inviteId > 0){
      //noinspection TypeScriptUnresolvedFunction
      this.tradeService.getInvite(this.player.id, this.invite.id).then(invite => {
        this.invite = invite;
/*
        this.playerService.getPlayer(invite.invitee).then((invitee: Player) => {
          this.invitee = invitee;
        });
        this.playerService.getPlayer(invite.invitee).then((inviter: Player) => {
          this.inviter = inviter;
        });
*/
      })
    }
  }

  cancelInvite(){
    if (!this.invite.creating()){
      //noinspection TypeScriptUnresolvedFunction
      this.tradeService.rejectInvite(this.invite).then(msg => {
        this.message = msg;
        if (this.alert)
          this.chatService.markAlertRead(this.alert);
      });
    }

    this.mask = true;
    this.close();
  }

  canAct(){
    if (!this.invite)
      return false;

    if (this.invite.creating()){
      return true;
    }
    else if (this.invite.responding()){
      return this.player.id == this.invite.invitee;
    }
    else {
      return false;
    }
  }

  proposeInvite(){
    let invite = this.invite;

    if (invite.creating()){
      invite.inviter = this.player.id;
      invite.invitee = this.otherPlayer.id;

      //noinspection TypeScriptUnresolvedFunction
      this.tradeService.offerInvite(invite).then(msg => {
        this.message = msg;
        if (this.alert) {
          this.chatService.markAlertRead(this.alert);
        }
      });

      this.mask = true;
      // this.close();
    }
    else if (invite.responding()){
      //noinspection TypeScriptUnresolvedFunction
      this.tradeService.acceptInvite(invite).then(msg => {
        this.message = msg;
        if (this.alert) {
          this.chatService.markAlertRead(this.alert);
        }
      });

      this.mask = true;
      // this.close();
    }
  }

  close() {
    if (this.invite.accepted() || this.invite.rejected()){
      this.chatService.markAlertRead(this.alert);
    }

    this.viewCtrl.dismiss();
  }

}
