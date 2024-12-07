import { Camera } from '@nativescript/camera';
import { Observable } from '@nativescript/core';

export class MediaService extends Observable {
  private static instance: MediaService;
  private camera: Camera;

  private constructor() {
    super();
    this.camera = new Camera();
  }

  static getInstance(): MediaService {
    if (!MediaService.instance) {
      MediaService.instance = new MediaService();
    }
    return MediaService.instance;
  }

  async captureImage(): Promise<string> {
    try {
      const imageAsset = await this.camera.takePicture();
      return imageAsset.android || imageAsset.ios;
    } catch (error) {
      console.error('Error capturing image:', error);
      throw error;
    }
  }

  async startAudioRecording(): Promise<void> {
    try {
      // Implementation for audio recording using native APIs
      console.log('Starting audio recording...');
    } catch (error) {
      console.error('Error starting audio recording:', error);
      throw error;
    }
  }

  async stopAudioRecording(): Promise<string> {
    try {
      // Implementation for stopping audio recording using native APIs
      console.log('Stopping audio recording...');
      return '';
    } catch (error) {
      console.error('Error stopping audio recording:', error);
      throw error;
    }
  }
}

export const mediaService = MediaService.getInstance();