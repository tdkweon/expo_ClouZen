import React from "react";
import { Text, View, TouchableOpacity } from "react-native";
import { useColorScheme } from "react-native";

export default function Search({navigation }) {
    console.log(navigation);
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
            <TouchableOpacity onPress={() => navigation.navigate("Photo")}>
                <Text style={{color: isDark ? "white" : "black"}}>Photo</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate("Movie")}>
                <Text style={{color: isDark ? "white" : "black"}}>Movie</Text>
            </TouchableOpacity>
        </View>
    );
}