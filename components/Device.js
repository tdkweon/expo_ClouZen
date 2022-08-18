// import { useNavigation } from "@react-navigation/native";
import React, { useEffect, useRef } from "react";
import { Animated, View, TouchableOpacity, Image } from "react-native";
import styled from "styled-components/native";
import {Ionicons, MaterialCommunityIcons } from "@expo/vector-icons"

const Wrapper = styled(Animated.createAnimatedComponent(View))`
    background-color: rgba(255, 0, 0, 0.5);
    padding: 40px;
    border-radius: 20px;
    align-items: center;    
`;
const DeviceName = styled.Text`
  color: white;
  font-weight: 600;
  font-size: 16px;
`;

// export const Icon = styled.Image`
//   border-radius: 20px;
//   width: 40px;
//   height: 40px;
//   margin-bottom: 10px;
// `;

const Icon = styled(MaterialCommunityIcons )`
    font-size: 24px;
    margin-right: 10px;
`;

const Device = ({ device, index, id, url }) => {
    // const navigation = useNavigation();
    const opacity = useRef(new Animated.Value(0)).current;
    useEffect(() => {
        Animated.spring(opacity, {
        toValue: 1,
        useNativeDriver: true,
        delay: index * 100,
        }).start();
    }, []);
    const scale = opacity.interpolate({
        inputRange: [0, 1],
        outputRange: [0.7, 1],
    });

    let BASE_URL = url; //`http://192.168.219.101/v1.0`;
    //let BASE_URL = `http://192.168.219.104:9100/v1.0`;
    const goFile = (device) => {
        const path = "/" + String(device.devNo)
        console.log('[Device] goFile : device.name=', device.name);
        console.log('[Device] goFile : path=', path);
        // if (timer) {
        //     console.log('[Home] goFile : ClearInterval')
        //     clearInterval(timer);
        // }
        // navigation.navigate("Stack", {
        //     screen: "Files",
        //     // screen: "Details",
        //     params: {
        //         path: path,
        //         url:BASE_URL,
        //     },
        // });
    };

    console.log(index, device, id);
    return (
        <TouchableOpacity
        style={{ flex: 0.45 }}
        //onPress={() => navigation.navigate("Detail", { device, id })}
        // onPress={() => goFile(device)}
        >
            <Wrapper style={{ opacity, transform: [{ scale }] }}>
                {/* <Icon name="devices" color="white" size={24} marginRight={20}
                /> */}
                {device.status === "READY" ? (<Icon name="lan-connect" color="black" size={20} paddingRight={20} />) : 
                            (<Icon name="lan-disconnect" color="black" size={20} marginRight={20} />)}
                <DeviceName>{device.name}</DeviceName>
                <DeviceName>{device.if_type}</DeviceName>
                <DeviceName>{device.status}</DeviceName>
            </Wrapper>
        </TouchableOpacity>
    );
};
export default React.memo(Device);