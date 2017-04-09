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
  // constructor(id: number, game: number, offerer: number, offeree: number, offererItem: number, offereeItem: number,
  //             offereOther: string, offereeOther: string, stage: number) {
  // }

  init(trade: Trade){
    this.id = trade.id;
    this.game = trade.game;
    this.offerer = trade.offerer;
    this.offeree = trade.offeree;
    this.offererItem = trade.offererItem;
    this.offereeItem = trade.offereeItem;
    this.offererOther = trade.offererOther;
    this.offereeOther = trade.offereeOther;
    this.stage = trade.stage;
  }

  creating(){
    return this.stage == 0;//TradeStage.Creating;
  }

  responding(){
    return this.stage == 1;//TradeStage.Offered;
  }

  accepting(){
    return this.stage == 2;//TradeStage.Counteroffered;
  }

  accepted(){
    return this.stage == 3;//TradeStage.Accepted;
  }

  rejected(){
    return this.stage == 4;//TradeStage.Rejected;
  }

  offerIsItem(){
    return this.offererItem != undefined;
  }

  counterofferIsItem(){
    return this.offereeItem != undefined;
  }

  offer(): any {
    if (/\+[0-9]+/.test(this.offererOther)) {
      let points = +this.offererOther.match(/([0-9]+)/)[1];
      return points + " point" + (points > 1 ? "s" : "");
    }
    else
      return this.offererOther;
  }

  counteroffer(): any {
    if (/\+[0-9]+/.test(this.offereeOther)) {
      let points = +this.offereeOther.match(/([0-9]+)/)[1];
      return points + " point" + (points > 1 ? "s" : "");
    }
    else
      return this.offereeOther;
  }
}
