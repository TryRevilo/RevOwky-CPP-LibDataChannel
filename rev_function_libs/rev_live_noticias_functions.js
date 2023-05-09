import notifee, {AndroidImportance} from '@notifee/react-native';

export const revOnDisplayNotification = async () => {
  // Request permissions (required for iOS)
  await notifee.requestPermission();

  // Create a channel (required for Android)
  const channelId = await notifee.createChannel({
    id: 'default',
    name: 'Default Channel',
  });

  // Display a notification
  await notifee.displayNotification({
    title: 'Mary Cooking Lunch - Ugali',
    body: 'Main body content of the notification. pressAction is needed if you want the notification to open the app when pressed . . .',
    android: {
      channelId,
      smallIcon: 'ic_launcher', // optional, defaults to 'ic_launcher'.
      // pressAction is needed if you want the notification to open the app when pressed
      pressAction: {
        id: 'default',
      },
    },
  });
};
