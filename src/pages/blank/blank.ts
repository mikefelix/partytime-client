import {Component} from "@angular/core";

@Component({
  selector: 'page-blank',
  templateUrl: 'blank.html'
})
export class BlankPage {

  constructor() {
  }

  debug(){
    return localStorage.getItem("player");
  }
}
