import AppLoading from 'expo-app-loading';
import React, { useState } from 'react';
import { Alert, Platform, Linking, NativeModules } from 'react-native';
import { Ionicons } from "@expo/vector-icons";
import * as Font from "expo-font";
import { Asset } from "expo-asset";
import TabNav from './navigators/TabNav';
import { NavigationContainer, useTheme  } from '@react-navigation/native';
import { QueryClient, QueryClientProvider } from "react-query";
import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';
import { Api } from "./api";
import { startActivityAsync, ActivityAction } from 'expo-intent-launcher';

/* ************************************************
    React Query instead of useState & fetch directly
    * https://react-query.tanstack.com/overview
************************************************ */ 
const queryClient = new QueryClient();

export default function App() {
    console.log("\n[App] ########### App #############");
    console.log("[App] Platform.OS =", Platform.OS);
    const theme = useTheme();
    /*
    Object {
    "colors": Object {
        "background": "rgb(242, 242, 242)",
        "border": "rgb(216, 216, 216)",
        "card": "rgb(255, 255, 255)",
        "notification": "rgb(255, 59, 48)",
        "primary": "rgb(0, 122, 255)",
        "text": "rgb(28, 28, 30)",
    },
    "dark": false,
    }*/

    const [loading, setLoading] = useState(true);
    const [isDeviceReady, setDeviceReady] = useState(false);
 
    /*#####################################################################*/
    /* AppLoading */
    const onStart = async() => {
        const start = new Date();

        /* font, icon */
        const fontsToLoad = [Ionicons.font];
        const fontPromises = fontsToLoad.map((font) => Font.loadAsync(font));

        /* image */
        const imagesToLoad = [
            require("./assets/logo.png"),
            require("./assets/logo_dark.png")
        ];
        const imagePromises = imagesToLoad.map((image) => Asset.loadAsync(image));

        /* local data & check device connection (url request timeout = 3 seconds) */
        const timeout = 3000
        const initInfoPromise = checkInitInfo(timeout);

        await Promise.all([...fontPromises, ...imagePromises, initInfoPromise]);

        const end = new Date();
        console.log(`[App] Loading duration ${(end -start)}ms`);

    };    

    const onFinish = () => {
        setLoading(false);
    };

    /*#####################################################################*/
    /* 순차적 처리 
    1. device info from local storage
        - data  : IP, sn => do 2.
        - wrong :        => skip 2.
    2. device info from remote device
    3. isDeviceConnected (set props)
      true  : goto Home
      false : goto popup alert & QRScan

    *** device connction info (later, TBC)
       wifi : if android => alert / ios => nothing
       usb  : if android => alert / ios => nothing
    ***/

  
    const checkInitInfo = async (timeout) => {
        let isDeviceReady = false;

        // await _storeDeviceInfo()
        // console.log('[App] 0. Device Info(To Storage) for Testing');

        // 1. get device infog from local storage
        const device_info = await getStorageInfo();
        console.log('[App] 1. Device Info(from Storage) = ', device_info);

        // 2. device info from remote device
        if (typeof(device_info) !== 'undefined' &&
                typeof(device_info.url) !== 'undefined' && device_info.url !== null &&
                typeof(device_info.sn) !== 'undefined' && device_info.sn !== null) {            
            
            console.log('[App] 2. Device Info(from device) = AWAIT 3sec');
            const fetchData = await Api.CheckReady(device_info.url, device_info.sn, timeout);    
            // console.log('retruned => ', fetchData);
            if(fetchData){
                console.log('[App:apiCheckReadyDevice] Device Info(from device) = ', fetchData);
                console.log(fetchData.hasOwnProperty('model'));
                if (fetchData.hasOwnProperty('model')){
                    if (fetchData.model === 'TAINER' && Object.entries(fetchData.net)[0][0] === 'Cloud'){
                        createTwoButtonAlert();    
                    }                  
                    console.log('[App] 3 ', Object.entries(fetchData.net)[0][0]);
                    // console.log('[App] 3. checked DeviceStatus = ', isDeviceReady); 
                    setDeviceReady(true)
                } else {
                    // not ready
                    console.log(fetchData);
                }
            }

        } else {
            console.log('[App] 2. Device Info(from device) = SKIPPED');
        }

        // 3. isDeviceReady
        // if (isDeviceReady) {
        //     /* TBC */
        //     // const netStatus = await getNetworkInfo();
        //     // console.log('[App] 1.1 Network Status = ', netStatus);     
        //     console.log('[App] 3. checked DeviceStatus = isDeviceReady'); 
        //     createTwoButtonAlert();
        //     setDeviceReady(isDeviceReady);
        // } 

        // console.log(`[App] 3. Device Ready = ${isDeviceReady}`);
    };    
   
    /*#####################################################################*/
    const getStorageInfo = async () => {
        try {
            const value = await AsyncStorage.getItem('device_info');
            if(value !== null) {
                const device_info = JSON.parse(value);  
                return device_info;
            }
        } catch(e) {
            console.log(e);
        }
      };
 
    // const apiCheckReadyDevice = async (url, sn, timeout) => {
    //     try {
    //         console.log('[apiCheckReadyDevice] fetching data...');
    //         const response = await Api.fetchWithTimeout(
    //             url+'/auth', {
    //                 method: "POST",                       
    //                 headers:{"cz-api-arg": JSON.stringify({'cmd': 'checkReady', 'sn':sn})},
    //                 timeout: timeout  
    //             }
    //         );
    //         const data = await  response.json();
    //         return data;
    //     } catch (error) {
    //         /**
    //          * catch [TypeError: Network request failed] = power OFF
    //          * [AbortError: Aborted] = power ON before auth
    //          */
    //         console.log('[apiCheckReadyDevice] try.. catch e =', error);
    //     }
    // };            
     

    const createTwoButtonAlert = () => {
        Alert.alert('Do you like to enable USB tehering?', 'Please enable USB tethering', [
            { text: 'Cancel', onPress: () => {}, style: 'cancel' },
            { text: 'OK', onPress: () => popupSetting() },
        ]);
    }

    const popupSetting = () => {
        if (Platform.OS === 'ios') {
            Linking.openURL('App-Prefs:root=INTERNET_TETHERING');
        }
        else if(Platform.OS === 'android'){
            startActivityAsync(ActivityAction.WIRELESS_SETTINGS);
        }
    };   

    //////////////////////////////////////////////////////////////////////////////////
    
    // Test
    const _storeDeviceInfo = async () => {
        try {
            const value = `http://192.168.219.101:9100/v1.0/`;
            const sn = `2112101234`;

            await AsyncStorage.setItem('device_info', JSON.stringify({'url':value, 'sn':sn}));
        } catch (e) {
            // saving error
            console.error(e);
        }
    };

    /*
    // Later... TBC 
    const getNetworkInfo = async () => {
        // To get the network state once 
        await NetInfo.fetch()
            .then((state) => {
                console.log('[App] Phone Network Info = ', {state});
                return true;
            })
            .catch((e) => {
                console.log(`[App] Phone Network Info = Error`, error.name);            
                return null;
            });
    } 
    */
    //////////////////////////////////////////////////////////////////////////////////

    console.log('loading',loading);
    console.log('isDeviceReady',isDeviceReady);

    if (loading && isDeviceReady === false) {
        return (
            <AppLoading 
                startAsync={onStart}
                onError={console.warn}
                onFinish={onFinish}
            />
        )
    }

    return (           
        <QueryClientProvider client={queryClient}>
            <NavigationContainer>
                <TabNav props={{'isDeviceReady': isDeviceReady}}/>
            </NavigationContainer>
        </QueryClientProvider>
    );
}



// import { Appearance } from 'react-native-appearance';
// import globals from './globals';
// import Realm from "realm";

/* ************************************************
    Realm is MogoDB
    https://www.mongodb.com/docs/realm/sdk/react-native/

    # realm.close(); #

************************************************ */ 
// const FileItemSchema = {
//     name: "FileItem",
//     embedded: true, // default: false
//     properties: {
//         flags: "int",       // Flag indicating file/video/photo etc.. Multiple bit can be set
//         name: "string",     // UTF8 format string
//         size: "double?",    // 64 bit unsigned decimal value
//         m_time: "date?",    // time_t 32bit decimal value. UTC, May not present if this is directory
//         c_time: "date?",    // (optional) time_t 32bit decimal value. UTC
//         c_sum: "string?",   // (optional) If exist, indicate string of checksum value from Cloud storage

//     },
// };

// const FileListSchema = {
//     name: "FileList",
//     primaryKey: "_id",
//     properties: {
//         _id: "objectId",
//         path: "string",        
//         note: "string?", // optional
//         items: { type: "list", objectType: "FileItem" }, // Embed an array of objects
//     },
// };

// const UploadItemSchema = {
//     name: "UploadItem",
//     embedded: true, // default: false
//     properties: {
//         flag: "int",
//         name: "string",
//         note: "string?", // optional
//     },
// };

// const UploadListSchema = {
//     name: "UploadList",
//     // primaryKey: "_id",
//     properties: {
//         // _id: "objectId",
//         path: "string",        
//         note: "string?", // optional
//         items: { type: "list", objectType: "UploadItem" }, // Embed an array of objects
//     },
// };

