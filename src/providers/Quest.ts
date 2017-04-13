import {Item} from "./Item";
import {Power} from "./Power";
export class Quest {
  id: number;
  name: string;
  master: number;
  description: string;
  items: Item[];
  powers: Power[];
  allies: number[];

  constructor(id: number){
    this.id = id;
    this.master = 0;
    this.items = [];
    this.powers = [];
    this.name = this.description = '';
    this.allies = [];
  }

}
