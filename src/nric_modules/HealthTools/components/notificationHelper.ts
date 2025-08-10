import PushNotification from 'react-native-push-notification';

PushNotification.configure({
  onRegister: function (token: { os: string; token: string }) {
    console.log('TOKEN:', token);
  },

  onNotification: function (notification: any) {
    console.log('LOCAL NOTIFICATION ==>', notification);
  },

  popInitialNotification: true,
  requestPermissions: true,
});


export const scheduleNotification = (title: string, message: string, date: Date) => {
  PushNotification.localNotificationSchedule({
    title,
    message,
    date,
    allowWhileIdle: true,
    repeatType: 'day',
  });
};
