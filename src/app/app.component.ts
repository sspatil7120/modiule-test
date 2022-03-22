import { Component } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'module-md-dev';
  isTwilioView = false;

  constructor(
    private route: ActivatedRoute,
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      console.error(" params in client app on init ", params);
    });

  }

  onVisitTwilioVideo() {
    this.isTwilioView = !this.isTwilioView;
  }


  async ngAfterViewInit() {
    this.route.queryParams.subscribe(params => {
      console.error(" params in client app ", params);
    });
  }
}
