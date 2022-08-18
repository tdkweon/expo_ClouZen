import React, { useState, useEffect, useLayoutEffect } from 'react';
import { StyleSheet, Linking, Alert, useColorScheme, Image } from 'react-native';
import styled from "styled-components/native";
import { BarCodeScanner } from 'expo-barcode-scanner';
import BarcodeMask from 'react-native-barcode-mask';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Container = styled.SafeAreaView`
    flex: 1;
    align-items: center;
    justify-content: center;
    background-color: black;
    padding: 0px 0px;
`;

const StatusText = styled.Text`
    color: white;
    font-size: 18px;
    font-weight: bold;
`;

export default function QRScan({navigation}) {
    const [hasPermission, setHasPermission] = useState(null);
    const [scanned, setScanned] = useState(false);

    console.log("####### QRScan #######");
    console.log("[QRScan] scanned=", scanned);
    
    const isDark = useColorScheme() === "dark"; 
    
    useLayoutEffect(() => {
        navigation.setOptions({
            headerTitleAlign:"center",
            headerStyle: {
                backgroundColor: isDark ? "rgba(0, 0, 0, 1)": "white",
                shadowColor: isDark ? "rgba(255, 255, 255, 0.3)" : "rgba(0, 0, 0, 0.3)",
            },                          
            headerTitleStyle: {
                color: isDark ? "white": "black"
            },       
            headerTitle: () => {
                if(isDark) {
                    return (<Image style={{ maxHeight:20 }} resizeMode="contain" source={require("../assets/logo_dark.png")} />);
                } else {
                    return (<Image style={{ maxHeight:20 }} resizeMode="contain" source={require("../assets/logo.png")} />);
                }},
        })
    },[navigation, isDark]);

    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            // do something - for example: reset states, ask for camera permission
            setScanned(false);
            setHasPermission(false);
            (async () => {
                const { status } = await BarCodeScanner.requestPermissionsAsync();
                setHasPermission(status === "granted"); 
            })();
        });
    
        // Return the function to unsubscribe from the event so it gets removed on unmount
        return unsubscribe;
    }, []);

    const handleBarCodeScanned = ({type, data}) => {
        // IMPORTANT (setScanned = True HERE)
        // This can be used to effectively "pause" the scanner so that it doesn't continually scan even after data has been retrieved
        setScanned(true);    
        console.log("[QRScan] 1.scanned data: ", data);

        const parsed_data = parseScanedData(data)
        console.log("[QRScan] 2.parsed data: ", parsed_data);

        if (Object.keys(parsed_data).length !== 0){
            goBrowser(data);
            console.log("[QRScan] 3.go Browser(Async)");

            storeDeviceInfo(parsed_data).then(ret => {
                console.log("[QRScan] 4.stored data: ", ret);
                goHome(parsed_data.url, parsed_data.sn);
            });
        } else {
            Alert.alert(
                "QR is not valid",
                data,
                [{ text: "Close", onPress: () => setScanned(false)}]
            );  
        }
    };
              
    ///////////////////////////////////////////////////////////////////////////
    /* Handle scanned data */
    const parseScanedData = (data) => {
        // https://auth.clouzen.kr/czlink?au=4769A2FC&sn=TN2112101234&dk=3814307B&ip="69DBA8C0"
        let info_obj = {}
        if(data.includes('http') && data.includes('au=') && data.includes('sn=') && data.includes('dk=') && data.includes('ip=')) {
            const tempArray = data.split('?');
            const infoArray = tempArray[1].split('&');
            for (const info of infoArray) {
                const items = info.split('=');
                const key = items[0];
                const value = items[1];
                if (key == "ip"){
                    const ip = convertHexToIP(value.replace('\"',''));
                    const url = `http://${ip}/v1.0`;
                    info_obj['url'] = url;
                } else {
                    info_obj[key] = value;
                }}}
        return info_obj;
    };

    const storeDeviceInfo = async (info_obj) => {        
        try {            
            await AsyncStorage.setItem('device_info', JSON.stringify(info_obj));
            return true;            
        } catch (e) {
            console.warn(e);
            return false;
        }
    };

    const convertHexToIP = (hex) => {
        let offset = 0;
        let r = [];
        for (let i = 0; i < 4; i++) {
            r[i] = hex.substr(offset, 2)
            offset += 2
        }
        // ***** ip reverse *****
        // r = r.reverse();
        let finalHex = r.join(".");   
        let splitData = finalHex.split(".");
        for (let i = 0; i < splitData.length; i++){
            splitData[i] = parseInt(splitData[i], 16);
        }
        return (splitData.join("."));
    };    

    //////////////////////////////////////////////////////////////////////////
    const goBrowser = (data) => {
        if(true){
            // return Promise
            Linking.openURL(data).catch(err => console.error('An error occured', err));
        }
    }

    const goHome = (url, sn) => {
        console.log("[QRScan] Go Home: ", url)
        navigation.navigate("Home", {
                screen: "HomeScreen",
                params: {url: url, sn: sn }});
    }
    
    // if (hasPermission === null) {
    //     return <Text>Requesting for camera permission</Text>;
    //     // alert(`Requesting for camera permission`);
    // }
    // if (hasPermission === false) {
    //     return <Text>No access to camera</Text>;
    //     // alert(`No access to camera`);

    return (
        <Container>
            {(hasPermission !== null) && (hasPermission === true) ? (
            <BarCodeScanner
                /* It is recommended to provide only the bar code formats you expect to scan to minimize battery usage.*/
                barCodeTypes={[BarCodeScanner.Constants.BarCodeType.qr]}
                onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
                style={[StyleSheet.absoluteFillObject]}
            >
                <BarcodeMask width={300} height={300} showAnimatedLine={false} outerMaskOpacity={0.5}/>
            </BarCodeScanner>
            ) : (
                <StatusText>Waiting for grant permission to camera...</StatusText>
            )}
        </Container>
    );
}
