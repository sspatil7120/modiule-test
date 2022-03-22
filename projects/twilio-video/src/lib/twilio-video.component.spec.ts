import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TwilioVideoComponent } from './twilio-video.component';

describe('TwilioVideoComponent', () => {
  let component: TwilioVideoComponent;
  let fixture: ComponentFixture<TwilioVideoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TwilioVideoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TwilioVideoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
