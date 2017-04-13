import {Power} from "./Power";
import {Item} from "./Item";
export class Player {
  id: number;
  name: string;
  alias: string;
  items: Item[];
  powers: Power[];
  score: number;

  constructor(id: number) {
    this.id = id;
    this.name = this.alias = '';
    this.score = 0;
    this.items = [];
    this.powers = [];
  }

}
