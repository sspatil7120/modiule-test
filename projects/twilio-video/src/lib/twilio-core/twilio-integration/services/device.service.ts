import {
  Injectable
} from '@angular/core';
import {
  Observable,
  ReplaySubject,
  BehaviorSubject
} from 'rxjs';

export type Devices = MediaDeviceInfo[];

@Injectable({
  providedIn: 'root'
})
export class DeviceService {

  $devicesUpdated: Observable < Promise < Devices >> ;

  private deviceBroadcast = new ReplaySubject < Promise < Devices >> ();
  public deviceGrantedStatus = new BehaviorSubject({});

  constructor() {
    if (navigator && navigator.mediaDevices) {
      navigator.mediaDevices.ondevicechange = (_: Event) => {
        this.deviceBroadcast.next(this.getDeviceOptions());
      }
    }

    this.$devicesUpdated = this.deviceBroadcast.asObservable();
    this.deviceBroadcast.next(this.getDeviceOptions());
  }

  async isGrantedMediaPermissions() {
    if (navigator && navigator['permissions']) {
      let camera : any = "camera";
      try {
        const result = await navigator['permissions'].query({
          name : camera
        });

        this.deviceGrantedStatus.next(result.state);
        if (result) {
          if (result.state === 'granted') {
            return true;
          } else {
            const isGranted = await new Promise < boolean > (resolve => {
              result.onchange = (_: Event) => {
                const granted = _.target['state'] === 'granted';
                if (granted) {
                  resolve(true);
                }
              }
            });

            return isGranted;
          }
        }
      } catch (e) {
        return true;
      }
    }

    return true;
  }

  private async getDeviceOptions(): Promise < Devices > {
    const isGranted = await this.isGrantedMediaPermissions();
    if (navigator && navigator.mediaDevices && isGranted) {
      let devices = await this.tryGetDevices();
      if (devices.every(d => !d.label)) {
        devices = await this.tryGetDevices();
      }
      return devices;
    }

    return null;
  }

  private async tryGetDevices() {
    const mediaDevices = await navigator.mediaDevices.enumerateDevices();
    const devices = ['audioinput', 'audiooutput', 'videoinput'].reduce((options, kind) => {
      return options[kind] = mediaDevices.filter(device => device.kind === kind);
    }, [] as Devices)

    return devices;
  }
}
