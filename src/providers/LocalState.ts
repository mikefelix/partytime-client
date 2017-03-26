import {Injectable} from "@angular/core";
import {Player} from "./Player";

@Injectable()
export class LocalState{
  player: Player;

  constructor(){

  }
}
