import React from "react";
import { Text, View, TouchableOpacity } from "react-native";
import { useColorScheme } from "react-native";

export default function Notes() {
    /* Home 화면에 필요한 parameters를 QRScan에서 받음 */
    // console.log(route );
    const isDark = useColorScheme() === "dark"; 
    return (
        <View
            style={{
                backgroundColor: isDark ? "black": "rgb(250, 250, 250)",
                flex: 1,
                alignItems: "center",
                justifyContent: "center"
            }}
        >
            <Text style={{color: isDark ? "white" : "black"}}>Photo</Text>
        </View>
    );
}