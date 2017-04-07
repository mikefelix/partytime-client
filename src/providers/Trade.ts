import {TradeStage} from "./TradeStage";
export class Trade {
  id: number;
  game: number;
  offerer: number;
  offeree: number;
  offererItem?: number;
  offereeItem?: number;
  offererOther?: string;
  offereeOther?: string;
  stage: number;

  constructor(id){this.id = id; this.stage = 0; this.game = 1;}

  creating(){
    return this.stage == TradeStage.Creating;
  }

  responding(){
    return this.stage == TradeStage.Offered;
  }

  accepting(){
    return this.stage == TradeStage.Counteroffered;
  }

  offer(): any {
    if (this.offererOther)
      return this.offererOther;
    else
      return this.offererItem;
  }

  counteroffer(): any {
    if (this.offereeOther)
      return this.offereeOther;
    else
      return this.offereeItem;
  }
}
