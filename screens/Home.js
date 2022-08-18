import React, { useState, useEffect, useRef } from "react";
import { Text, View, BackHandler, TouchableOpacity, RefreshControl, Alert, useColorScheme } from "react-native";
import { FlatList } from "react-native-gesture-handler";
// import { useColorScheme } from "react-native";
import styled from "styled-components/native";
import { Api } from "../api";
import ScreenLayout from "../components/ScreenLayout";
import Device from "../components/Device";
import CardView from "../components/CardView";
import {Ionicons, MaterialCommunityIcons } from "@expo/vector-icons"
// import ExplorerDynamic from "../screens/ExplorerDynamic";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useIsFocused } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { CardStyles } from "../styles";
import useInterval from "../hooks/useInterval";


export default function Home({ route, navigation }) {

    /* Home 화면에 필요한 parameters를 QRScan에서 받음 */
    console.log("####### Home #######");
    console.log(route);
    
    const isDark = useColorScheme() === "dark"; 
    let isFocused = useIsFocused(); // isFoucesd Define (화면 refresh => call useEffect)
    console.log('isFocused=', isFocused);

    // BASE_URL = `http://192.168.16.140/v1.0`;
    const [isPolling, setPolling] = useState(true);
    const [refreshing, setRefreshinig] = useState(false);
    const [loading, setLoading] = useState(true);
    const [devices, setDevices] = useState([]);
    const [base_url, setBaseUrl] = useState('');
  
    useEffect(() => {
        navigation.setOptions({
            //title:path,
            headerRight: () => (
                <TouchableOpacity onPress={()=>{onRefresh()}}>
                    <Ionicons 
                        name={"refresh-outline"} 
                        color={isDark ? "white":"black"} 
                        size={25} 
                        style={{marginEnd:10}} 
                    />
                </TouchableOpacity>
            )    
        });
        // const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);        
        // getAllData();


        /* Polling */
        // Need to compare previous & current data, before update
        // const timer = setInterval(()=>{ getAllData(base_url); }, 5000);
        let delay = 3000;
        const timer = setInterval(()=>{ 
            console.log('### setInterval >>>');
            let url = null;
            let sn = null;            
            const fetchData = async () => {
                if (route.params !== undefined && route.params.url) {
                    console.log('1. Get url from QR:', route.params.url, route.params.sn);   
                    url = route.params.url;
                    sn = route.params.sn;
                } else {
                    const device_info = await getDeviceInfo();
                    if (device_info) {
                        url = device_info.url;
                        sn = device_info.sn;
                        console.log('>>> Get url from storage:',device_info );   
                    }    
                }                
                // get the data from the api
                const response = await Api.fetchWithTimeout(
                    url+'/auth', {
                        method: "POST",                       
                        headers:{"cz-api-arg": JSON.stringify({'cmd': 'checkReady', 'sn':sn})},
                        timeout: 3000  
                    }
                );
                const data = await response.json();
                console.log('>>> Get url from storage:',data );   
                console.log('>>> Get url from storage:',data.net.LAN.status);  
                if (data.hasOwnProperty('model')){
                    if (data.model === 'TAINER' && (Object.entries(data.net.LAN?.status === 'connected' || Object.entries(data.net.Cloud?.status === 'connected')))){
                        clearInterval(timer);
                        setPolling(false);
                        getAllData();
                    }
                }
            }

            // call the function
            fetchData()
            .catch(e => console.log('setInterval', e))

        }, delay);

        // useInterval(() => {
        //     const fetchReady = Api.CheckReady(url, sn, 1000);
        //     if (fetchData?.model === 'TAINER' && Object.entries(fetchData?.net)[0][0]['status'] === 'connected'){
        //         delay = null;
        //         console.log('useInterval STOPPED');     
        //         getAllData();                
        //     }
        // }, delay);
        return () => {
            console.log('### Reached cleanup function ###');
            clearInterval(timer);
        };

        // return () => isFocused=false;
        // return () => backHandler.remove();
    //}, []);
    }, [isFocused]);

    /* 화면을 아래로 내릴때 refresh 기능 */
    const onRefresh = async() =>
    {
        console.log("Refrshing...");
        setRefreshinig(true);
        await getAllData();
        setRefreshinig(false);
    };

    const backAction = () => {
        Alert.alert('Exit App', 'Are you sure you want to exit?', [
        {
            text: 'Cancel',
            onPress: () => null,
            style: 'cancel',
        },
        { text: 'YES', onPress: () => BackHandler.exitApp() },
        ]);
        return true;
    };
    /************************************************************************************* */
        /* Home 화면에 필요한 ㅁ모든 Data를 가져옴 */
    const getAllData = async () => {
        let url = null;
        let sn = null;
        try {
            // 순차적 처리
            // 1. Get URL
            if (route.params !== undefined && route.params.url) {
                console.log('1. Get url from QR:', route.params.url);   
                url = route.params.url;
                sn = route.params.sn;
            } else {
                const device_info = await getDeviceInfo();
                if (device_info) {
                    url = device_info.url;
                    sn = device_info.sn;
                    console.log('1. Get url from storage:',device_info );   
                }    
            }

            // 2. Get Data
            if(url) {
                // const fetchReady = await Api.CheckReady(url, sn, 1000);  
                // if (fetchData.model === 'TAINER' && Object.entries(fetchData.net)[0][0]['status'] === 'connected'){
                //     const timer = setInterval(()=>{ getAllData(base_url); }, 5000);
                //     return () => {
                //         console.log('### Reached cleanup function ###');
                //         clearInterval(timer);
                //     };
                // }   

                const fetchData = await Api.DeviceStatus(url, 3000);   
                if (fetchData) {
                    console.log('[Home:getAllData] DeviceStatus (from device) = ', fetchData);
                    const final_data = manipulateRes(fetchData);
                    setDevices(final_data);
                    setBaseUrl(url);
                    setLoading(false);        
                } else {
                    console.log('[Home:getAllData] DeviceStatus (from device) = ', fetchData);
                    // setDevices([]);
                    // setLoading(true);  
                }

            } else {
                if (isFocused) {
                    Alert.alert(
                        "Help",
                        `No device information, \nPlease scan QR code`,
                        [{ text: "OK", onPress: () => { goQRScan() }}],
                    ) 
                }
            }
        } catch(error) {
            console.log('[Home:getAllData] error', error);
            // console.warn(error);
            setDevices([]);
            setLoading(true);             
        }
    };

    const getDeviceInfo = async () => {
        try {
            const value = await AsyncStorage.getItem('device_info');
            if(value !== null) {
                const device_info = JSON.parse(value);  
                return device_info;
            }
        } catch(e) {
            console.warn(e);
            throw Error('AsyncStorage Error');
        } 
        return null;
    };

    // const getDevices = async (url) => {
    //     // rif (!url) return null;
    //     // let response = null;
    //     console.log('Base url:', url+'/dev');
    //     try{
    //         const jsonData = await Api.fetchWithTimeout(
    //             url+'/dev',                
    //             {
    //                 method: "GET",
    //                 headers:{"cz-api-arg": JSON.stringify({'cmd': 'DeviceStatus'})},
    //                 timeout: 3000  
    //             },
    //         )
    //         .then((jsonData) => {
    //             if(jsonData) {
    //                 console.log('[Home:getDevices] jsonData=', jsonData);
    //                 if(jsonData){
    //                     const final_data = manipulateRes(jsonData);
    //                     setDevices(final_data);
    //                     setBaseUrl(url);
    //                     setLoading(false);  
    //                 }                   
    //             }}
    //         );
    //     } catch {(e) => {
    //         console.log(`[Home:getDevices] error =`, e);         
    //         Alert.alert(
    //                     "Connection Error",
    //                     "Cannot fetch data from a device\nPlease check connection",
    //                     [{ text: "Close", }]
    //         );                         
    //     }};            
    //     // } catch(e) {
    //     //     // console.error(e);
    //     //     // 연결 오류 메세지
    //     //     Alert.alert(
    //     //         "Connection Error",
    //     //         "Cannot fetch data from a device\nPlease check connection",
    //     //         [{ text: "Close", }]
    //     //     );            
    //     //     throw Error('Fetch Error');
    //     // } finally {
    //     //     console.log('2. Get devices from remote');
    //     // }
    //     // return response;
    // };  

    // const getDevices = async (url) => {
    //     // rif (!url) return null;
    //     let response = null;
    //     console.log('Base url:', url+'/dev');
    //     try {
    //         response = await (
    //             await Api.fetchWithTimeout(
    //                 url+'/dev',                
    //                 {
    //                     method: "GET",
    //                     headers:{"cz-api-arg": JSON.stringify({'cmd': 'DeviceStatus'})},
    //                     timeout: 3000  
    //                 },
    //             )
    //         ).json();
    //     } catch(e) {
    //         // console.error(e);
    //         // 연결 오류 메세지
    //         Alert.alert(
    //             "Connection Error",
    //             "Cannot fetch data from a device\nPlease check connection",
    //             [{ text: "Close", }]
    //         );            
    //         throw Error('Fetch Error');
    //     } finally {
    //         console.log('2. Get devices from remote');
    //     }
    //     return response;
    // };  

    const manipulateRes = (response) => {
        console.log('[Home] getDevice : seqNo=', response.seqNo);      
        /* If necessary, Clean data */
        if (response){
            const cleanData = response.devices.filter((dev) => dev.status == "READY");       
            let sortedDevices = cleanData.sort((a, b) => (a.status === "DISCONNECTED") ? 1: -1);
            console.log("Sorted = ",sortedDevices);        
            return sortedDevices;
        }
        return null;
    }



    const goQRScan = () => {
        navigation.navigate("QRScan");
    }

    const goExplorer = (item) => {
        const subPath = "/" + String(item.devNo);
        console.log('[Home] goExplorer : device.name=', item.name);
        console.log('[Home] goExplorer : path=', subPath);
        console.log('[Home] goExplorer : url=', base_url);
        
        if (item.status === "READY"){
            navigation.navigate("Explorer", {
                path: subPath,
                url:base_url,
                // index: 0,
                // tabs: [{title: subPath, key: subPath}],
            });
        }
        // if (timer) {
        //     console.log('[Home] goFile : ClearInterval')
        //     clearInterval(timer);
        // }

        /* Dynamic */
    //     navigation.navigate("ExplorerDynamic", {
    //         path: subPath,
    //         url:BASE_URL,
    //         index: 0,
    //         tabs: [{title: subPath, key: subPath}],
    //  });        
    };

    const forceRefresh = () => {
        isFocused = !isFocused;
        console.log('forceRefresh = ', isFocused);
    }


    const formatSizeUnits = (bytes) => {
        if      (bytes >= 1073741824) { bytes = (bytes / 1073741824).toFixed(2) + " GB"; }
        else if (bytes >= 1048576)    { bytes = (bytes / 1048576).toFixed(2) + " MB"; }
        else if (bytes >= 1024)       { bytes = (bytes / 1024).toFixed(2) + " KB"; }
        else if (bytes > 1)           { bytes = bytes + " bytes"; }
        else if (bytes == 1)          { bytes = bytes + " byte"; }
        else                          { bytes = "0 bytes"; }
        return bytes;
    }

    const renderDevice = ({item}) => {
        // console.log("Type => ", item);
        return (
            <CardView 
                isDark={isDark}
                onPress={() => goExplorer(item)}
                style={{margin: 5, height:170, width:170, alignItems:'center', justifyContent:'center'}}>
                <CardStyles.DeviceBox isDark={isDark}>
                    {item.if_type && (item.if_type).includes("HDD") ? (<CardStyles.DeviceImage source={require("../assets/Card_Reader.png")}/>) : null}
                    {item.if_type && (item.if_type).includes("SD") ? (<CardStyles.DeviceImage source={require("../assets/sd.png")}/>) : null}
                    {item.if_type && (item.if_type).includes("SATA") ? (<CardStyles.DeviceImage source={require("../assets/Nvme_M2.png")}/>) : null}
                    {item.if_type && (item.if_type).includes("PEX") ? (<CardStyles.DeviceImage source={require("../assets/Nvme_M2.png")}/>) : null}
                    {item.if_type && (item.if_type).includes("LAN") ? (<CardStyles.DeviceImage source={require("../assets/XQD.png")}/>) : null}
                    {item.if_type && (item.if_type).includes("PHONE") ? (<CardStyles.DeviceImage source={require("../assets/cf_express.png")}/>) : null}
                    {(item.status) === "CHECKING" ? (<CardStyles.DeviceImage source={require("../assets/question-mark.png")}/>) : null}
                    {(item.status) === "DISCONNECTED" ? (<CardStyles.DeviceImage source={require("../assets/text.png")}/>) : null}
                </CardStyles.DeviceBox>
                <CardStyles.DeviceName isDark={isDark}>{item.name}</CardStyles.DeviceName>
                <CardStyles.DeviceDesc isDark={isDark}>{item.if_type}</CardStyles.DeviceDesc>
                <CardStyles.DeviceSize isDark={isDark}>{item.total_size? formatSizeUnits(item.total_size):"0 bytes"}</CardStyles.DeviceSize>
            </CardView>
        );
    };

    console.log('isPolling', isPolling);

    return (
        // {isPolling} ? (
        //     <View style={{
        //         flex: 1,
        //         justifyContent: 'center',
        //         alignItems: 'center',
        //         fontWeight: 'bold',
        //     }}>
        //         <Text>Waiting for device connection and user login</Text>
        //     </View>
        // ):
        // (
            <ScreenLayout loading={loading}>         
                {devices && devices.length ? (
                    <FlatList
                        refreshControl={
                            <RefreshControl onRefresh={onRefresh} refreshing={refreshing} />
                        } 
                        style={{ 
                            width: "100%",
                            padding: 20,
                            marginVertical: 10,
                            marginHorizontal: 10,
                        }}
                        data={devices}
                        ItemSeparatorComponent={() => <View style={{ height: 20 }} />}
                        numColumns={2}
                        columnWrapperStyle={{
                            // bordercolor: "red",
                            // borderWidth: 1,
                            justifyContent: "space-between",
                        }}
                        // Booton 가리는 문제
                        contentContainerStyle={{paddingBottom: 30}}
                        // onPress={() => goExplorer(item)}
                        keyExtractor={(item) => item.devNo}
                        renderItem={renderDevice}
                    />
                ) : (
                    <Text>No device</Text>
                )}
            </ScreenLayout>
        // )
    );
}


// const styles = StyleSheet.create({
//     container: {
//         flex:1,
//         flexDirection: 'column',
//         justifyContent: 'center',
//         alignItems: 'center',
//         backgroundColor: 'lightgrey',
//     },
//     buttonGrad: {
//         height: 170,
//         width: 170,
//         borderRadius: 20,
//         position: 'absolute',
//         bottom: 3,
//         alignItems: 'center',
//     },
//     buttonParent: {
//         height: 173,
//         width: 172,
//         borderRadius: 20,
//     },
//     imageBox: {
//         height: 100,
//         width: 100,
//         marginTop: 5,
//         marginBottom: 5,
//     },
//     image: {
//         flex: 1,
//         height: '100%',
//         width: '100%',
//         // alignItems: 'center',
//         resizeMode: 'stretch',
//     },
//     textName: {
//         color: 'black',
//         fontWeight: '600',
//         fontSize: 20,
//     },
//     textDesc: {
//         color: 'darkgrey',
//     },
//     textName: {
//         color: 'black',
//     },
// })

   // const _getDeviceInfo = async () => {
    //     try {
    //         const value = await AsyncStorage.getItem('device_info');
    //         if(value !== null) {
    //             const device_info = JSON.parse(value);  
    //             return device_info;
    //         }
    //     } catch(e) {
    //         // error reading value
    //         console.error(e);
    //         return null;
    //     }
    //     return null;
    // };


    // const setInitUrl = async () => {
    //     if (route.params === null) {
    //         const device_info = await getDeviceInfo();
    //         setUrl(device_info.url);
    //         console.log('2. device_info:', device_info);
    //     }
    // }
      
    // const getDevices = () => {
    //     try {
    //         console.log('url:', url+'/dev');
    //         // console.log('BASE_URL', BASE_URL);
    //         fetch(
    //             url+'/dev',                
    //             {
    //                 method: "GET",
    //                 headers:{"cz-api-arg": JSON.stringify({'cmd': 'deviceStatus'})},
    //             },
    //         ).then(res => {
    //             console.log(res);
    //             if(!res.ok){
    //                 throw Error('Fetch Error.');
    //             }
    //         }).then(data =>{
    //             console.log('[Home] getDevice : seqNo=', data.seqNo); 
    //             let sortedDevices = response.devices.sort((a, b) => (a.status === "DISCONNECTED") ? 1: -1);
    //             console.log("Sorted = ",sortedDevices);
                
    //             setDevices(sortedDevices);
    //             setLoading(false);
    //         })
    //         .catch(err => {
    //             console.warn(err.message);
    //         });
            
    //         console.log('@@@@@@@@@@@@@@@@@@@@@@@');
    //     }
    //     catch(err){
    //         console.error(err);
    //     }
    // };      
    
    // const getTemplate = () => {};
    // const checkDeviceInfo = async () => {
    //     const device_info = await _getDeviceInfo();
    //     console.log('[Home] Device Info(from Storage) = ', device_info);
    //     if (device_info !== null) {
    //         setUrl(device_info.url);
    //     }

    // }

    // return (
    //     <ScreenLayout loading={loading}>            
    //         <FlatList
    //             refreshControl={
    //                 <RefreshControl onRefresh={onRefresh} refreshing={refreshing} />
    //             } 
    //             style={{ 
    //                 width: "100%",
    //                 padding: 20,
    //                 marginVertical: 10,
    //                 marginHorizontal: 10,
    //             }}
    //             data={devices}
    //             ItemSeparatorComponent={() => <View style={{ height: 20 }} />}
    //             numColumns={2}
    //             columnWrapperStyle={{
    //                 // bordercolor: "red",
    //                 // borderWidth: 1,
    //                 justifyContent: "space-between",
    //             }}
    //             // onPress={() => goExplorer(item)}
    //             keyExtractor={(item) => item.devNo}
    //             renderItem={renderDevice}
    //         />
    //     </ScreenLayout>
    // );

//     const Card = styled.View`
//     background-color: "rgba(150, 150, 150, 1)";
//     padding: 40px;
//     border-radius: 20px;
//     align-items: center;     
//     width: 160px;
//     height: 160px;
//     color: "rgba(255, 255, 255, 1)";
//     align-items: center;    
//     font-weight: 800;
//     font-size: 26px;  

//     elevation: 8;
// `;

// const DeviceIcon = styled.Image`
//     margin-top: -20px;
//     margin-bottom: 5px;
//     width: 60px;
//     height: 60px;
// `;


    //#############################################################
// import { StyleSheet, Image } from 'react-native';
// import { LinearGradient } from 'expo-linear-gradient';

// const styles = StyleSheet.create({
//     container: {
//         flex: 1,
//         flexDirection: 'column',
//         justifyContent: 'center',
//         alignItems: 'center',
//         backgroundColor: 'lightgrey',
//     },
//     buttonGrad: {
//         height: 160,
//         width: 160,
//         borderRadius: 20,
//         position: 'absolute',
//         bottom: 3,
//         alignItems: 'center'
//     },
//     buttonParent: {
//         height: 162,
//         width: 161,
//         borderRadius: 20,
//     },
//     imageBox: {
//         height: 80,
//         width: 80,
//         marginTop: 20,
//         marginBottom: 5,
//     },
//     image: {
//         flex: 1,
//         height: '100%',
//         width: '100%',
//         resizeMode: 'stretch',
//     },    
//     textName: {
//         color: 'black',
//         fontWeight: '600',
//         fontSize: 20,
//     },
//     textDesc: {
//         color: 'darkgrey',
//     },
//     textSize: {
//         color: 'black',
//     }
// })


            // <TouchableOpacity onPress={() => goExplorer(item)} >
            //     {/* <Card>
            //         {item.if_type === "HDD" ? (<DeviceIcon source={require("../assets/Card_Reader.png")}/>) : null}
            //         {item.if_type === "SD" ? (<DeviceIcon source={require("../assets/sd.png")}/>) : null}
            //         {item.if_type === "PEX 5G" ? (<DeviceIcon source={require("../assets/Nvme_M2.png")}/>) : null}
            //         {item.if_type === "Network" ? (<DeviceIcon source={require("../assets/XQD.png")}/>) : null}
            //         {item.if_type === "PHONE" ? (<DeviceIcon source={require("../assets/cf_express.png")}/>) : null}
            //         {item.if_type === undefined ? (<DeviceIcon source={require("../assets/text.png")}/>) : null}
            //         <DeviceDesc>{item.name}</DeviceDesc>
            //         <DeviceDesc>{item.status}</DeviceDesc>
            //     </Card>                 */}

            //     <CardView 
            //         onPress={() => goExplorer(item)}
            //         style={{margin: 5, height:170, width:170, alignItems:'center', justifyContent:'center'}}>
            //         <DeviceBox>
            //             {item.if_type && (item.if_type).includes("HDD") ? (<DeviceImage source={require("../assets/Card_Reader.png")}/>) : null}
            //             {item.if_type && (item.if_type).includes("SD") ? (<DeviceImage source={require("../assets/sd.png")}/>) : null}
            //             {item.if_type && (item.if_type).includes("SATA") ? (<DeviceImage source={require("../assets/Nvme_M2.png")}/>) : null}
            //             {item.if_type && (item.if_type).includes("PEX") ? (<DeviceImage source={require("../assets/Nvme_M2.png")}/>) : null}
            //             {item.if_type && (item.if_type).includes("LAN") ? (<DeviceImage source={require("../assets/XQD.png")}/>) : null}
            //             {item.if_type && (item.if_type).includes("PHONE") ? (<DeviceImage source={require("../assets/cf_express.png")}/>) : null}
            //             {(item.status) === "CHECKING" ? (<DeviceImage style={styles.image} source={require("../assets/question-mark.png")}/>) : null}
            //             {(item.status) === "DISCONNECTED" ? (<DeviceImage style={styles.image} source={require("../assets/text.png")}/>) : null}
            //         </DeviceBox>
            //         <DeviceName>{item.name}</DeviceName>
            //         <DeviceDesc>{item.if_type}</DeviceDesc>
            //         <DeviceSize>{item.total_size? formatSizeUnits(item.total_size):"0 bytes"}</DeviceSize>
            //     </CardView>

            //     {/* <View style={styles.buttonParent}>
            //         <LinearGradient 
            //             // background Linear Gradient
            //             colors={['white', 'darkgrey']}
            //             style={styles.buttonParent}
            //         />
            //         <LinearGradient 
            //             // background Linear Gradient
            //             colors={['white', 'lightgrey']}
            //             style={styles.buttonGrad}
            //         >   
            //             <View style={styles.imageBox}>
            //                 {item.if_type && (item.if_type).includes("HDD") ? (<Image style={styles.image} source={require("../assets/Card_Reader.png")}/>) : null}
            //                 {item.if_type && (item.if_type).includes("SD") ? (<Image style={styles.image} source={require("../assets/sd.png")}/>) : null}
            //                 {item.if_type && (item.if_type).includes("SATA") ? (<Image style={styles.image} source={require("../assets/Nvme_M2.png")}/>) : null}
            //                 {item.if_type && (item.if_type).includes("PEX") ? (<Image style={styles.image} source={require("../assets/Nvme_M2.png")}/>) : null}
            //                 {item.if_type && (item.if_type).includes("LAN") ? (<Image style={styles.image} source={require("../assets/XQD.png")}/>) : null}
            //                 {item.if_type && (item.if_type).includes("PHONE") ? (<Image style={styles.image} source={require("../assets/cf_express.png")}/>) : null}
            //                 {(item.status) === "CHECKING" ? (<Image style={styles.image} source={require("../assets/question-mark.png")}/>) : null}
            //                 {(item.status) === "DISCONNECTED" ? (<Image style={styles.image} source={require("../assets/text.png")}/>) : null}
            //             </View>
            //             <Text style={styles.textName}>{item.name}</Text>
            //             <Text style={styles.textDesc}>{item.if_type}</Text>
            //             <Text style={styles.textSize}>{item.total_size? formatSizeUnits(item.total_size):"0 bytes"}</Text>
            //         </LinearGradient>                
            //     </View> */}

            // </TouchableOpacity>