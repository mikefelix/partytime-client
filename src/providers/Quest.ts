import {Item} from "./Item";
import {Power} from "./Power";
export class Quest {
  id: number;
  name: string;
  master: number;
  description: string;
  items: Item[];
  powers: Power[];

  constructor(){
  }

}
