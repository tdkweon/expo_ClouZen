import React, { useEffect, useLayoutEffect, useState } from "react";
import { Image, View, TouchableOpacity, Linking, Alert, useColorScheme, ActivityIndicator } from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import NetInfo from '@react-native-community/netinfo';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AppStyles, SettigsStyles } from "../styles";
import { Api } from "../api";

export default function Settings({navigation}) {
    console.log("########### Settings #############");
    const isDark = useColorScheme() === "dark"; 
    const settingsOptions=[
        { index: 1, title: 'Information', subTitle: '', onPress: () => {} },
        { index: 2, title: 'Device', subTitle: '', onPress: () => {} },
        { index: 3, title: 'Network (Phone)', subTitle: '', onPress: () => {} },
        { index: 4, title: 'Storage (Phone)', subTitle: '', onPress: () => {} },
        // { index: 5, title: 'USB (Phone)', subTitle: '', onPress: () => {} },
    ];
    const [ready, setReady] = useState(false);
    const [storageInfo, setStorageInfo] = useState({});
    const [networkInfo, setNetworkInfo] = useState({});
    const [deviceInfo, setDeviceInfo] = useState({'isLAN': false, 'isCloud': false});

    /****************************************************
    useEffect는 화면 그리고, useEffect 실행 후 reRendering
    useLayoutEffect는 useLayoutEffect 실행 후 reRendering

    useLayoutEffect(() => {
        effect
        return () => {
            cleanup
        };
    }, [input])
    ****************************************************/
    useLayoutEffect(() => {
        navigation.setOptions({
            headerTitleAlign:"center",
            headerStyle: { 
                backgroundColor: isDark ? "black": "white",                        
            },
            headerTitleStyle: {
                color: isDark ? "white": "black"
            },       
            headerTitle: () => {
                if(isDark) {
                    return (<Image style={{ maxHeight:20 }} resizeMode="contain" source={require("../assets/logo_dark.png")} />);
                } else {
                    return (<Image style={{ maxHeight:20 }} resizeMode="contain" source={require("../assets/logo.png")} />);
                }
            },     
            headerRight: () => (
                <TouchableOpacity onPress={()=>{setReady(false)}}>
                    <Ionicons 
                        name={"refresh-outline"} 
                        color={isDark ? "white":"black"} 
                        size={25} 
                        style={{marginEnd:10}} 
                    />
                </TouchableOpacity>
            )        
        })
    },[navigation, isDark]);

    useEffect(() => {
        console.log('useEffect: ready=',ready);
        console.log('useEffect: storage=',storageInfo);
        console.log('useEffect: network=',networkInfo);
        /* Subscribe to network state updates */
        const unsubscribe = NetInfo.addEventListener((state) => {
            setNetworkInfo(state);
        });

        /* Get storage & network info from phone */
        getStorageInfo();        
        getNetworkInfo();

        /* Get device info from Device */
        if (storageInfo.url && storageInfo.sn){
            getDeviceInfo(storageInfo.url, storageInfo.sn, 3000);
        }

        setReady(true);

        return () => {
            /* Unsubscribe to network state updates */
            unsubscribe();
        };
    }, [ready]);

    /*******************************************
     * Get informations
     */        
    /* 
        "model": "TAINER",
        "net": Object {
            "Cloud": Object {
                "ip": "192.168.232.146",
                "manufacture": "SAMSUNG",
                "product": "SAMSUNG_Android",
                "ready": true,
                "serial": "R3CM40J3XXD",
                "status": "connected",
            },
            "LAN": Object {
                "ip": "192.168.232.146",
                "status": "connected",
            },    
        },
    */
    const getDeviceInfo = async (url, sn, timeout) => {        
        const fetchData = await Api.CheckReady(url, sn, timeout);    
        console.log('getDeviceInfo => ', fetchData);
        if(fetchData){
            console.log('[Setting:CheckReady] Device Info(from device) = ', fetchData.net);
            if (fetchData.hasOwnProperty('model')){
                if (fetchData.model === 'TAINER') {
                    if ('LAN' in fetchData.net) {
                        console.log('fetchData.net.LAN?.status',fetchData.net.LAN.status);
                        setDeviceInfo(prevState => ({
                            ...prevState,
                            'isLAN': true,
                        }))
                    }
                    if ('Cloud' in fetchData.net) {
                        console.log('fetchData.net.Cloud?.status',fetchData.net.Cloud.status);
                        setDeviceInfo(prevState => ({
                            ...prevState,
                            'isCloud': true,
                        }))
                    }
                } 
            } else {
                // not ready
                console.log(fetchData);
            }
        }
        
        // Api.fetchWithTimeout(
        //     url+'/auth',                
        //     {
        //         method: "POST",                       
        //         headers:{"cz-api-arg": JSON.stringify({'cmd': 'checkReady', 'sn':sn})},
        //         timeout: timeout  
        //     })
        // .then(res => res.json())
        // .then((json) => {
        //     if (json) {
        //         console.log('[Settings] 2. Device Info(from device) = ', json);
        //         // if (json.model === 'TAINER'){
        //         //     // do something
        //         //      setDeviceInfo()
        //         // } 
        //     } else {
        //         console.log(`[Settings] 2. Device Info(from device) = timeout ${timeout}ms`);
        //     }    
        //     return json;
        // })
        // .catch((e) => {
        //     console.log(`[Settings] apiCheckReadyDevice error =`, e.name);            
        //     return null;
        // });
    }


    const getStorageInfo = async () => {
        try {
            AsyncStorage.getItem('device_info')
            .then((value) => {
                if(value) {
                    const device = JSON.parse(value);  
                    const dev_info = {'url': device.url, 'sn':device.sn, 'dk': device.dk, 'au': device.au};
                    setStorageInfo(dev_info);
                    console.log('[Settings] 1. Device Info(from Storage) = ', device);
                }
                else {
                    // setReady(false);
                    const dev_info = {'url': '', 'sn':'', 'dk': '', 'au': ''};
                    setStorageInfo(dev_info);
                    console.log('[Settings] 1. Device Info(from Storage) = NULL');
                }
            })
        } catch(e) {
            console.warn("getStorageInfo:", e);
        }
    };

    const getNetworkInfo = () => {
        /* To get the network state once */
        try {
            NetInfo.fetch().then((state) => 
            {
                if (state){
                    const ip = state.details.ipAddress;
                    const type = state.type;
                    const isConnected = state.isConnected;
                    const isWifiEnabled = state.isWifiEnabled;
                    setNetworkInfo({ip:ip, type:type, isConnected:isConnected, isWifiEnabled, isWifiEnabled});
                    console.log('[Settings] 2. Network Info(from Phone) = ', networkInfo);
                } else {
                    setNetworkInfo({ip:'', type:'', isConnected:'', isWifiEnabled:''});
                    console.log('[Settings] 2. Network Info(from Phone) = NULL');
                }
            });
        } catch(e) {
            console.warn("getNetworkInfo:", e);
        }
    };

    const clearStorage = async () => {   
        // readStorage();     
        try {            
            AsyncStorage.getAllKeys()
                .then((keys) => {
                    console.log(keys);
                    if (keys && keys.length){
                        Alert.alert(
                            "Clear Storage",
                            `Please check data before delete\n\nurl: ${storageInfo.url}\nsn: ${storageInfo.sn}\ndk: ********\nau: ********`
                            ,[
                                { text: "Cancel",style: "cancel" },
                                { text: "OK", onPress: () => { 
                                    AsyncStorage.multiRemove(keys);
                                    setReady(false);
                                }}
                            ]
                        );
                    }
                    else {
                        Alert.alert(
                            "Clear Storage",
                            "Storage is already empty",
                            [{ text: "Close",style: "close" }],
                        )
                    }
            })            
            return true;            
        } catch (e) {
            console.warn(e);
            return false;
        }
    };        

    /******************************************************************************** */
    // For Test
    const readStorage = async () => {        
        AsyncStorage.getAllKeys((err, keys) => {
            AsyncStorage.multiGet(keys, (error, stores) => {
                stores.map((result, i, store) => {
                    console.log({ [store[i][0]]: store[i][1] });
                    return true;
                });
            });
        });
    }

    const storeData = async () => {
        try {
            const value = {
                model: "Test Model",
                manual_ip: "192.168.219.105",
                auto_ip: "",
            };
            const jsonValue = JSON.stringify(value)
            await AsyncStorage.setItem('device_info', jsonValue)
        } catch (e) {
            // saving error
            alert('saving error');
        }
    };

    const onApplyIp = async() => {
        console.log('onApplyIp = ', storageInfo);
        try {
            await AsyncStorage.setItem('device_info', JSON.stringify({manual_ip: ip}))
        } catch (e) {
            alert('updating error');
        }
    };
    /******************************************************************************** */

    /*******************************************
     * Rendering functions
     */
     const renderClouzenInfo = (title) =>{
        const homepage = "https://www.clouzen.kr";
        const tethering_iso = "https://support.apple.com/en-mn/guide/iphone/iph45447ca6/ios"
        const tethering_android = "https://support.google.com/android/answer/9059108?hl=en#zippy=%2Ctether-by-usb-cable"

        // const address = "경기도 화성시 동탄기흥로 570-6, 골든아이타워 205호";
        // const phone = "031 5183 9682";
        // const email = "contactus@clouzen.kr";       
        const version = "V.0.1";   
        return (
            <View>
                <View style={{flexDirection: "row", alignItems: "center"}}>
                    <MaterialCommunityIcons 
                        name={"information-outline"} 
                        color={isDark ? "white":"black"} 
                        size={40} 
                        style={{alignItems: "center", paddingLeft: 5, paddingRight: 10, paddingBottom: 10}} 
                    />
                    <SettigsStyles.SectionTitle  isDark={isDark}>{title}</SettigsStyles.SectionTitle>
                </View>

                <SettigsStyles.SectionItem  isDark={isDark} >
                    <SettigsStyles.SectionText isDark={isDark}>App Version</SettigsStyles.SectionText>
                    <SettigsStyles.SectionDesc isDark={isDark}>{version}</SettigsStyles.SectionDesc>
                    <SettigsStyles.SettingsSeparator isDark={isDark} />
                    <SettigsStyles.SectionText  isDark={isDark}>Homepage</SettigsStyles.SectionText>
                    <TouchableOpacity onPress={() => Linking.openURL(homepage)}>
                        <SettigsStyles.SectionDesc style={{color:"blue"}}  isDark={isDark}>{homepage}</SettigsStyles.SectionDesc>
                    </TouchableOpacity>
                    <SettigsStyles.SettingsSeparator isDark={isDark} />
                    <SettigsStyles.SectionText isDark={isDark}>Guide: Phone Connection (USB Tethering)</SettigsStyles.SectionText>
                    <View style={{flexDirection: "row"}}>
                        <SettigsStyles.SectionButton onPress={() => Linking.openURL(tethering_iso)}>
                            <SettigsStyles.SectionText isDark={isDark}>iOS</SettigsStyles.SectionText>
                        </SettigsStyles.SectionButton>
                        <SettigsStyles.SectionButton onPress={() => Linking.openURL(tethering_android)}>
                            <SettigsStyles.SectionText isDark={isDark}>Anndroid</SettigsStyles.SectionText>
                        </SettigsStyles.SectionButton>
                    </View>
                    {/* <SettigsStyles.SectionText isDark={isDark}>Address</SettigsStyles.SectionText>
                    <SettigsStyles.SectionDesc isDark={isDark}>{address}</SettigsStyles.SectionDesc>
                    <SettigsStyles.SectionText isDark={isDark}>Tel.</SettigsStyles.SectionText>
                    <SettigsStyles.SectionDesc isDark={isDark}>{phone}</SettigsStyles.SectionDesc>
                    <SettigsStyles.SectionText isDark={isDark}>Email</SettigsStyles.SectionText>
                    <SettigsStyles.SectionDesc isDark={isDark}>{email}</SettigsStyles.SectionDesc> */}

                </SettigsStyles.SectionItem>
            </View>
        );
    };

    const renderDeviceInfo = (title) => {
        const model = "Model 111";
        const version = "V.0.0";
        console.log('render device:', deviceInfo);
        return (
        <View>
            <View style={{flexDirection: "row", alignItems: "center"}}>
                <MaterialCommunityIcons 
                    name={"devices"} 
                    color={isDark ? "white":"black"} 
                    size={40} 
                    style={{alignItems: "center", paddingLeft: 5, paddingRight: 10, paddingBottom: 10}} 
                />
                <SettigsStyles.SectionTitle  isDark={isDark}>{title}</SettigsStyles.SectionTitle>
            </View>

            <SettigsStyles.SectionItem  isDark={isDark} >
                <SettigsStyles.SectionText isDark={isDark}>[Model]</SettigsStyles.SectionText>
                <SettigsStyles.SectionDesc isDark={isDark}>{model? model: "Unknown" }</SettigsStyles.SectionDesc>
                <SettigsStyles.SettingsSeparator isDark={isDark} />
                <SettigsStyles.SectionText isDark={isDark}>[Device Version]</SettigsStyles.SectionText>
                <SettigsStyles.SectionDesc isDark={isDark}>{version? version: "Unknown" }</SettigsStyles.SectionDesc>
                <SettigsStyles.SettingsSeparator isDark={isDark} />
                <SettigsStyles.SectionText isDark={isDark}>[is Ethernet(LAN) connected?]</SettigsStyles.SectionText>
                <SettigsStyles.SectionDesc isDark={isDark}>{deviceInfo.isLAN.toString()}</SettigsStyles.SectionDesc>
                <SettigsStyles.SettingsSeparator isDark={isDark} />
                <SettigsStyles.SectionText isDark={isDark}>[is USB(Cloud) connected?]</SettigsStyles.SectionText>
                <SettigsStyles.SectionDesc isDark={isDark}>{deviceInfo.isCloud.toString()}</SettigsStyles.SectionDesc>

            </SettigsStyles.SectionItem>
        </View>            
        );        
    };

    const renderNetworkInfo = (title) =>{
        // console.log('getNetworkInfo > ', networkInfo.isConnected);
        return (
            <View>
                <View style={{flexDirection: "row", alignItems: "center"}}>
                    <MaterialCommunityIcons 
                        name={"wifi"} 
                        color={isDark ? "white":"black"} 
                        size={40} 
                        style={{alignItems: "center", paddingLeft: 5, paddingRight: 10, paddingBottom: 10}} 
                    />
                   <SettigsStyles.SectionTitle  isDark={isDark}>{title}</SettigsStyles.SectionTitle>
                </View>            
                <SettigsStyles.SectionItem  isDark={isDark} >
                    <SettigsStyles.SectionText isDark={isDark}>[Type]</SettigsStyles.SectionText>
                    <SettigsStyles.SectionDesc isDark={isDark}>{networkInfo.type? networkInfo.type: "Unknown"}</SettigsStyles.SectionDesc>
                    <SettigsStyles.SettingsSeparator isDark={isDark} />
                    <SettigsStyles.SectionText isDark={isDark}>[Mobile IP]</SettigsStyles.SectionText>
                    <SettigsStyles.SectionDesc isDark={isDark}>{networkInfo.ip? networkInfo.ip:"Unknown"}</SettigsStyles.SectionDesc>
                    <SettigsStyles.SettingsSeparator isDark={isDark} />
                    <SettigsStyles.SectionText isDark={isDark}>[Is Connected?]</SettigsStyles.SectionText>
                    <SettigsStyles.SectionDesc isDark={isDark}>{String(networkInfo.isConnected)}</SettigsStyles.SectionDesc>
                    <SettigsStyles.SettingsSeparator isDark={isDark} />
                    <SettigsStyles.SectionText isDark={isDark}>[Wifi Enable?]</SettigsStyles.SectionText>
                    <SettigsStyles.SectionDesc isDark={isDark}>{String(networkInfo.isWifiEnabled)}</SettigsStyles.SectionDesc>
                </SettigsStyles.SectionItem>                
            </View>
        );
    }

    const renderUsbInfo = (title) => {
        return (
            <View>
                <View style={{flexDirection: "row", alignItems: "center"}}>
                    <MaterialCommunityIcons 
                        name={"usb"} 
                        color={isDark ? "white":"black"} 
                        size={40} 
                        style={{alignItems: "center", paddingLeft: 5, paddingRight: 10, paddingBottom: 10}} 
                    />
                    <SettigsStyles.SectionTitle  isDark={isDark}>{title}</SettigsStyles.SectionTitle>
                </View>
                <SettigsStyles.SectionItem  isDark={isDark} >
                    <SettigsStyles.SectionText isDark={isDark}>[Info 1]</SettigsStyles.SectionText>
                    <SettigsStyles.SectionDesc isDark={isDark}>{"Unknown"}</SettigsStyles.SectionDesc>
                    <SettigsStyles.SettingsSeparator isDark={isDark} />
                    <SettigsStyles.SectionText isDark={isDark}>[Info 2]</SettigsStyles.SectionText>
                    <SettigsStyles.SectionDesc isDark={isDark}>{"Unknown"}</SettigsStyles.SectionDesc>
                </SettigsStyles.SectionItem>                                    
            </View>
        )
    };

    const renderStorageInfo = (title) => {
        return (
            <View>
                <View style={{flexDirection: "row", alignItems: "center"}}>
                    <MaterialCommunityIcons 
                        name={"database"} 
                        color={isDark ? "white":"black"} 
                        size={40} 
                        style={{alignItems: "center", paddingLeft: 5, paddingRight: 10, paddingBottom: 10}} 
                    />
                    <SettigsStyles.SectionTitle  isDark={isDark}>{title}</SettigsStyles.SectionTitle>
                </View>
                <SettigsStyles.SectionItem  isDark={isDark} >
                <SettigsStyles.SectionText isDark={isDark}>[URL]</SettigsStyles.SectionText>
                    <SettigsStyles.SectionDesc isDark={isDark}>{storageInfo.url? storageInfo.url:"Unknown"}</SettigsStyles.SectionDesc>
                    <SettigsStyles.SettingsSeparator isDark={isDark} />
                    <SettigsStyles.SectionText isDark={isDark}>[Serial Number]</SettigsStyles.SectionText>
                    <SettigsStyles.SectionDesc isDark={isDark}>{storageInfo.sn? storageInfo.sn:"Unknown"}</SettigsStyles.SectionDesc>
                    <View>
                        <SettigsStyles.SectionButton onPress={() => clearStorage()}>
                            <SettigsStyles.SectionText isDark={isDark}>Clear storage</SettigsStyles.SectionText>
                        </SettigsStyles.SectionButton>
                    </View>                    
                </SettigsStyles.SectionItem>                                    
            </View>
        )        
    };

    return !ready ? (
        <AppStyles.Loader>
            <ActivityIndicator animating={true} size="large" style={{opacity:1}} color="#999999"  />
        </AppStyles.Loader>
        ) : (
        <SettigsStyles.SettingsContainer isDark={isDark}>
            {settingsOptions.map(({index, title}) => (
                <SettigsStyles.Section key={index} isDark={isDark}>
                    { index === 1 ? renderClouzenInfo(title) : 
                        index === 2 ? renderDeviceInfo(title) :
                            index === 3 ? renderNetworkInfo(title) :
                                index === 4 ? renderStorageInfo(title) :
                                    index === 5 ? renderUsbInfo(title) : null }
                </SettigsStyles.Section>
            ))}
        </SettigsStyles.SettingsContainer>
    );
}
