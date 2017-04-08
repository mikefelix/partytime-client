import {Component} from "@angular/core";

@Component({
  selector: 'page-blank',
  templateUrl: 'blank.html'
})
export class BlankPage {

  constructor() {
  }

  debug(){
    if (localStorage.getItem("player").match(/function/))
      localStorage.clear()

    return localStorage.getItem("player");
  }
}
