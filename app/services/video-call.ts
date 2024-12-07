import { WebRTC } from '@nativescript/webrtc';
import { Observable } from '@nativescript/core';

export class VideoCallService extends Observable {
  private static instance: VideoCallService;
  private webrtc: WebRTC;
  private currentCall: any = null;

  private constructor() {
    super();
    this.webrtc = new WebRTC();
    this.setupWebRTC();
  }

  static getInstance(): VideoCallService {
    if (!VideoCallService.instance) {
      VideoCallService.instance = new VideoCallService();
    }
    return VideoCallService.instance;
  }

  private setupWebRTC() {
    this.webrtc.on('connectionStateChange', (event: any) => {
      this.notify({
        eventName: 'connectionStateChange',
        object: this,
        data: event
      });
    });

    this.webrtc.on('dataChannel', (event: any) => {
      this.notify({
        eventName: 'dataChannel',
        object: this,
        data: event
      });
    });
  }

  async startCall(remoteUserId: string): Promise<void> {
    try {
      if (this.currentCall) {
        throw new Error('Already in a call');
      }

      const configuration = {
        iceServers: [
          { urls: 'stun:stun.l.google.com:19302' }
        ]
      };

      this.currentCall = await this.webrtc.createConnection(configuration);
      // Additional call setup logic here
    } catch (error) {
      console.error('Error starting call:', error);
      throw error;
    }
  }

  async endCall(): Promise<void> {
    try {
      if (!this.currentCall) {
        return;
      }

      await this.currentCall.close();
      this.currentCall = null;
    } catch (error) {
      console.error('Error ending call:', error);
      throw error;
    }
  }
}

export const videoCallService = VideoCallService.getInstance();