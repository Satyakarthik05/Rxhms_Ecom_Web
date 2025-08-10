declare module 'react-native-push-notification' {
  import { Component } from 'react';
  import { PermissionStatus } from 'react-native';

  export interface PushNotificationObject {
    message: string;
    date?: Date;
    title?: string;
    playSound?: boolean;
    soundName?: string;
    number?: number;
    repeatType?: 'time' | 'minute' | 'hour' | 'day' | 'week' | 'month' | 'year';
    repeatTime?: number;
    id?: string | number;
    actions?: string;
    userInfo?: any;
    allowWhileIdle?: boolean;
    // ... other props as needed
  }

 export interface PushNotification {
  configure(options: {
    onRegister: (token: { os: string; token: string }) => void;
    onNotification: (notification: any) => void;
    onAction?: (notification: any) => void;
    onRegistrationError?: (err: any) => void;
    permissions?: {
      alert?: boolean;
      badge?: boolean;
      sound?: boolean;
    };
    popInitialNotification?: boolean;
    requestPermissions?: boolean;
  }): void;

  localNotification(details: PushNotificationObject): void;

  localNotificationSchedule(details: PushNotificationObject): void; // ✅ FIXED NAME

  cancelLocalNotifications(details: { id: string | number }): void;

  cancelAllLocalNotifications(): void;

  checkPermissions(callback: (permissions: { alert: boolean; badge: boolean; sound: boolean }) => void): void;

  requestPermissions(permissions?: { alert?: boolean; badge?: boolean; sound?: boolean }): Promise<PermissionStatus>;

  abandonPermissions(): void;
}


  const PushNotification: PushNotification;

  export default PushNotification;
}
