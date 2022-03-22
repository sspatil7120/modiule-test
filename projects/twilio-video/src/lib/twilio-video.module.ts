import { NgModule } from '@angular/core';
import { TwilioIntegrationModule } from './twilio-core/twilio-integration/twilio-integration.module';
import { TwilioVideoComponent } from './twilio-video.component';



@NgModule({
  declarations: [
    TwilioVideoComponent
  ],
  imports: [
    TwilioIntegrationModule
  ],
  exports: [
    TwilioVideoComponent
  ]
})
export class TwilioVideoModule { }
