import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TwilioIntegrationRoutingModule } from './twilio-integration-routing.module';
import { WaitingRoomComponent } from './waiting-room/waiting-room.component';
import { CameraComponent } from './camera/camera.component';
import { GuideUserComponent } from './camera/guide-user/guide-user.component';
import { ManageWebcamComponent } from './camera/manage-webcam/manage-webcam.component';


@NgModule({
  declarations: [
    WaitingRoomComponent,
    CameraComponent,
    GuideUserComponent,
    ManageWebcamComponent
  ],
  imports: [
    CommonModule,
    TwilioIntegrationRoutingModule
  ],
  exports: [
    WaitingRoomComponent
  ]
})
export class TwilioIntegrationModule { }
