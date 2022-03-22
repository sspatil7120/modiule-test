import {
  Injectable
} from '@angular/core';
import {
  Observable,
  ReplaySubject,
  BehaviorSubject
} from 'rxjs';
import {
  HttpClient
} from '@angular/common/http';
import {
  connect,
  ConnectOptions,
  LocalTrack,
  Room
} from 'twilio-video';
import {
  environment
} from 'src/environments/environment';

interface AuthToken {
  token: string;
}

export interface NamedRoom {
  id: string;
  name: string;
  maxParticipants?: number;
  participantCount: number;
}

export type Rooms = NamedRoom[];

@Injectable({
  providedIn: 'root'
})
export class VideoChatService {

  baseUrl = "environment.baseUrl";
  $roomsUpdated: Observable<boolean>;
  $localStreams = new BehaviorSubject({});

  public isAudioMuted = new ReplaySubject<boolean>();
  public isVideoMuted = new ReplaySubject<boolean>();

  private roomBroadcast = new ReplaySubject<boolean>();

  public localParticipantSubject = new BehaviorSubject({});
  public inviteeSubject = new BehaviorSubject({});
  public invitationDetails = new BehaviorSubject({});
  public activeRoomSubject = new BehaviorSubject({});

  constructor(private readonly http: HttpClient) {
    this.$roomsUpdated = this.roomBroadcast.asObservable();
  }

  private async getAuthToken(roomName, userName) {
    userName = `INVITEE, ${userName}`;
    const auth =
      await this.http.get<AuthToken>(`${this.baseUrl}communicator-service/api/v1/video/room/token?room=${roomName}&user=${userName}`)
        .toPromise();

    return auth.token;
  }

  getAllRooms() {
    return this.http.get<Rooms>(`${this.baseUrl}communicator-service/api/v1/video/room/getAllRooms`).toPromise();
  }

  createRoom(appointmentId) {
    return this.http.get(`${this.baseUrl}communicator-service/api/v1/video/room/create`, {
      params: {
        'appointmentId': appointmentId
      }
    });
  }

  async joinRoom(roomName: string, userName: string, tracks: LocalTrack[]) {
    let room: Room = null;
    try {
      const token = await this.getAuthToken(roomName, userName);
      room = await connect(token, {
        tracks,
        networkQuality: {
          local: 2,
          remote: 1
        },
        preferredVideoCodecs: ['H264', 'VP8']
      } as ConnectOptions);
      console.log("Local participants : " + room.localParticipant)
      this.localParticipantSubject.next(room.localParticipant);
    } catch (error) {
      console.error(`Unable to connect to Room: ${error.message}`);
    } finally {
      if (room) {
        this.roomBroadcast.next(true);
      }
    }

    return room;

  }

  getParticipant(appointmentId) {
    return this.http.get(`${this.baseUrl}communicator-service/api/v1/video/room/participants?appointmentId=${appointmentId}`);
  }

  getOnDemandParticipant(appointmentId) {
    return this.http.get(`${this.baseUrl}communicator-service/api/v1/video/on-demand/room/participants?appointmentId=${appointmentId}`);
  }

  deleteAllParticipant(appointmentId) {
    return this.http.delete(`${this.baseUrl}communicator-service/api/v1/video/room/participants?appointmentId=${appointmentId}`);
  }

  addParticipant(participant) {
    this.inviteeSubject.next(participant);
    return this.http.post(`${this.baseUrl}communicator-service/api/v1/pusher/trigger`, participant);
  }

  addOnDemandParticipant(participant) {
    this.inviteeSubject.next(participant);
    return this.http.post(`${this.baseUrl}communicator-service/api/v1/pusher/on-demand/trigger`, participant);
  }

  deleteParticipant(participant) {
    return this.http.put(this.baseUrl + "communicator-service/api/v1/pusher/trigger", participant);
  }

  deleteOnDemandParticipant(participant) {
    return this.http.put(this.baseUrl + "communicator-service/api/v1/pusher/on-demand/trigger", participant);
  }

  getAppointment(appointmentId) {
    return this.http.get(`${this.baseUrl}communicator-service/api/v1/video/room/appointment/${appointmentId}`);
  }

  getOnDemandAppointment(appointmentId) {
    return this.http.get(`${this.baseUrl}communicator-service/api/v1/video/on-demand/room/appointment/${appointmentId}`);
  }

  nudge() {
    this.roomBroadcast.next(true);
  }

  async setLocalStreams(stream) {
    this.$localStreams.next(stream);
  }

  postRequestOrCancel(event, data) {
    return this.http.post(`${this.baseUrl}communicator-service/api/v1/pusher/trigger-patient-or-provider?event=${event}`, data);
  }
}
