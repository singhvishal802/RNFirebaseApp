import {View, Text, SafeAreaView} from 'react-native';
import React,{useEffect} from 'react';
import messaging from '@react-native-firebase/messaging';


const App = () => {


  useEffect(() => {
    requestUserPermission();
    messageListener();
  }, []);

  const requestUserPermission = async () => {
    const authStatus = await messaging().requestPermission({
      alert: true,
      announcement: false,
      badge: true,
      carPlay: true,
      provisional: false,
      sound: true,
    });
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;
    if (enabled) {
      getFcmToken();
    } else {
      console.log('Authorization status1:', authStatus);
    }
  };

  const getFcmToken = async () => {
    await messaging().registerDeviceForRemoteMessages();
    const fcmToken = await messaging().getToken();
    if (fcmToken) {
      console.log('Your Firebase Token is:', fcmToken);
    } else {
      console.log('Failed', 'No token received');
    }
  };

   const messageListener = () => {
     try {
       messaging().onMessage(remoteMessage => {
         console.log(
           'Notification caused app to open from foreground state:',
           remoteMessage,
         );
       });
       messaging().onNotificationOpenedApp(remoteMessage => {
         console.log(
           'Notification121 caused app to open from background state:',
           remoteMessage,
         );
       });

       // Check whether an initial notification is available
       messaging()
         .getInitialNotification()
         .then(async remoteMessage => {
           if (remoteMessage) {
             console.log(
               'Notification caused app to open from quit state:',
               remoteMessage,
             );
           }
         });
     } catch (error) {
       console.log(`error===>>>`, error);
     }
   };
  

  return (
    <SafeAreaView
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
      }}>
      <Text style={{color:'#000000',fontSize:16}}>App</Text>
    </SafeAreaView>
  );
};

export default App;
