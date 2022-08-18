import React, {useLayoutEffect} from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { useColorScheme, Image, Platform, View } from "react-native";
import Upload from "../screens/Upload";
import Photo from "../screens/Photo";
import Movie from "../screens/Movie";
import Search from "../screens/Search";
import Home from "../screens/Home";
import Explorer from "../screens/Explorer";
import {Ionicons } from "@expo/vector-icons";
import Notes from "../screens/Notes";
// import ExplorerDynamic from "../screens/ExplorerDynamic";

const Stack = createStackNavigator();

export default function StackNavFactory({screenName}) {
    const isDark = useColorScheme() === "dark"; 

    // const routeName = useRoute();
    // console.log('@StackNavFactory', route);
    // console.log('@StackNavFactory',navigation);
    // console.log('@StackNavFactory',routeName);
    // useLayoutEffect(() => {        
    //     if (routeName === 'Photo') {
    //       navigation.setOptions({tabBarVisible: false});
    //     } else {
    //       navigation.setOptions({tabBarVisible: true});
    //     }
    // }, [navigation, route]);
        
    return (
        /* 
            Photo, Movie는 Home/Upload Tab screen에서 공유
            Configuration도 한번만 하면 됨
        */
        <Stack.Navigator
            screenOptions={{
                animation: 'slide_from_right',
                gestureEnabled:true,             
                headerMode: "screen",
                headerBackTitleVisible: false,
                headerTintColor: isDark ? "white" : "black",
                headerTitleAlign: 'center',
                // headerBackImageSource: () => {<Ionicons name="chevron-back" style={{height: 16, width: 16}} />},
                // headerBackImageSource: () => <Cross style={{ marginLeft: 10 }} />,
                // headerBackImageSource: <Image
                //                             source={require('../assets/logo_dark.png')}
                //                         />,
                headerStyle: {
                    backgroundColor: isDark ? "rgba(0, 0, 0, 1)": "white",
                    shadowColor: isDark ? "rgba(255, 255, 255, 0.3)" : "rgba(0, 0, 0, 0.3)",
                },
                // headerLeft: () => (
                //     Platform.OS === "ios" ?
                //         <View style={{ flexDirection: "row", justifyContent: "center", alignItems: "center", marginLeft: 4 }}>
                //             <MyCustomHeaderBackImage />
                //             <Text style={{ color: "#fff", fontSize: 20 }}>Back</Text>
                //         </View>
                //         :
                //         <View style={{ flexDirection: "row", justifyContent: "flex-start", alignItems: "center", paddingLeft: 8, width: 50, height: 50 }}>
                //             <MyCustomHeaderBackImage />
                //         </View>
                //   ),                
                // headerBackImageSource: () => {
                //     isDark ? (<Image style={{ maxHeight:20 }} resizeMode="contain" source={require("../assets/back_small.png")} />) :
                //             (<Image style={{ maxHeight:20 }} resizeMode="contain" source={require("../assets/back_small.png")} />)
                // }
            }}
        >
            {screenName === "Home" ? (
                <Stack.Screen name={"HomeScreen"} component={Home} 
                    options={{
                        headerTitle: () => {
                            if(isDark) {
                                return (<Image style={{ maxHeight:20 }} resizeMode="contain" source={require("../assets/logo_dark.png")} />);
                            } else {
                                return (<Image style={{ maxHeight:20 }} resizeMode="contain" source={require("../assets/logo.png")} />);
                            }
                        },          
                    }}
                >
                    {/* {() => <ExplorerDynamic screenName="ExplorerDynamic" />} */}
                    {/* <Stack.Screen name="ExplorerDynamic" component={ExplorerDynamic} /> */}
                </Stack.Screen>
            ) : null}
            {screenName === "Upload" ? (
                <Stack.Screen name={"UploadScreen"} component={Upload} />                
            ) : null}
            {/* {screenName === "Search" ? (
                <Stack.Screen name={"SearchScreen"} component={Search} />                
            ) : null}                         */}
            <Stack.Screen name="Explorer" component={Explorer} 
                // options={{
                //     headerBackImageSource: () => {
                //         isDark ? (<Image style={{ maxHeight:20 }} resizeMode="contain" source={require("../assets/back_small.png")} />) :
                //                 (<Image style={{ maxHeight:20 }} resizeMode="contain" source={require("../assets/back_small.png")} />)
                //     }}}      
            />
            {/* <Stack.Screen name="ExplorerDynamic" component={ExplorerDynamic} />  */}

            <Stack.Screen name="Photo" component={Photo} 
                options={{
                    headerShown: false,
                    tabBarVisible:false,
                    tabBarStyle: { display: "none" },
                }}/>

            <Stack.Screen name="Movie" component={Movie} />
            <Stack.Screen name="Notes" component={Notes} />
        </Stack.Navigator>
    );
}