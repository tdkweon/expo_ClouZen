import React from "react";
import { ActivityIndicator, View } from "react-native";
import { useColorScheme } from "react-native";

export default function ScreenLayout({loading, children}) {
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
            {loading ? <ActivityIndicator animating={true} size="large" style={{opacity:1}} color="#999999"  /> : children}
        </View>
    );
}

{/* <TouchableOpacity onPress={() => navigation.navigate("Photo")}>
<Text style={{color: isDark ? "white" : "black"}}>Photo</Text>
</TouchableOpacity>
<TouchableOpacity onPress={() => navigation.navigate("Movie")}>
<Text style={{color: isDark ? "white" : "black"}}>Movie</Text>
</TouchableOpacity> */}
