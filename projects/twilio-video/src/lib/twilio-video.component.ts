import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'lib-twilio-video',
  template: `
    <p>
      twilio-video works!
      <lib-waiting-room></lib-waiting-room>
    </p>
  `,
  styles: [
  ]
})
export class TwilioVideoComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
