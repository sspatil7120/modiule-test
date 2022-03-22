import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'lib-manage-webcam',
  templateUrl: './manage-webcam.component.html',
  styleUrls: ['./manage-webcam.component.css']
})
export class ManageWebcamComponent implements OnInit {

  browser:string;
  
  constructor() { }

  ngOnInit() {
    this.detectBrowser();
  }

  detectBrowser() {
    const agent = window.navigator.userAgent.toLowerCase()
    console.log("agent", agent)
    
    if(agent.indexOf('chrome') > -1 && !!(<any>window).chrome) {
      this.browser = 'chrome';
    } else if(agent.indexOf('firefox') > -1) {
      this.browser = 'firefox';
    } else if(agent.indexOf('safari') > -1) {
      this.browser = 'safari';
    } else {
      this.browser = 'NA';
    }
  }

}
