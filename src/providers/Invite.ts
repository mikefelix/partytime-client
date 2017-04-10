export class Invite {
  id: number;
  game: number;
  inviter: number;
  invitee: number;
  // quest: number;
  stage: number;

  constructor(id){this.id = id; this.stage = 0; this.game = 1;}

  init(invite: Invite){
    this.id = invite.id;
    this.game = invite.game;
    this.inviter = invite.inviter;
    this.invitee = invite.invitee;
    this.stage = invite.stage;
  }

  creating(){
    return this.stage == 0;//InviteStage.Creating;
  }

  responding(){
    return this.stage == 1;//InviteStage.Offered;
  }

  accepted(){
    return this.stage == 2;//InviteStage.Accepted;
  }

  rejected(){
    return this.stage == 3;//InviteStage.Rejected;
  }

}
