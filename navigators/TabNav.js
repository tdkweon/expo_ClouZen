import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { useColorScheme, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import QRScan from "../screens/QRScan";
import Settings from "../screens/Settings";
import StackNavFactory from "./StackNavFactory";
import { colors } from "../colors";

// import { useRoute } from '@react-navigation/native';
import { getFocusedRouteNameFromRoute } from '@react-navigation/native';

const Tabs = createBottomTabNavigator();

export default function TabNav({props}) {
    const isDark = useColorScheme() === "dark";   
    // console.log('[TabNav] is Dark mode?' , isDark);
    console.log('[TabNav]', props);
    let firstScreen = "QRScan";
    if (props.isDeviceReady) {
        firstScreen = "Home";
    }

    return (
        <Tabs.Navigator
            initialRouteName={firstScreen}
            screenOptions={{
                headerShown: false,
                // headerStyle: { backgroundColor: isDark ? "black": "white" },
                // headerTitleStyle: {
                //     color: isDark ? "white": "black",
                //     paddingTop: 0,
                //     alignSelf: 'center',
                //     justifyContent: 'center'
                // },
                // tabBarActiveTintColor: isDark ? "yellow": "blue",
                // tabBarInactiveTintColor: "red",                    
                tabBarStyle: {
                    backgroundColor: isDark ? colors.dark.toolbarBackground: colors.light.toolbarBackground,
                    borderTopColor: isDark ? colors.dark.screenSeparator: colors.light.screenSeparator,
                }                
            }}
        >
            <Tabs.Screen 
                name="Home"    
                options={({route}) => ({               
                    headerShown: false,       
                    // tabBarBadge: "New"
                    // headerLeft: (props) => (
                    //     <MyButton
                    //       {...props}
                    //       onPress={() => {
                    //         // Do something
                    //       }}
                    //     />
                    //   ),
                    // headerRight: () => (
                    //     <View><Text>icon</Text></View>
                    // ),
                    // icon from http://icons.expo.fyi 
                    tabBarIcon: ({focused, color, size}) => (
                        <Ionicons name={focused ? "home" : "home-outline"} color={color} size={size} />
                    ), 
                    // tabBarStyle: { display: "none" },
                    tabBarStyle: ((route) => {
                        const routeName = getFocusedRouteNameFromRoute(route) ?? ""            
                        if (routeName === "Photo" || routeName === "Movie") {
                            return { display: "none" }
                        }            
                    })(route),
                })}      
            >
                {() => <StackNavFactory screenName="Home" />}
            </Tabs.Screen>           

            <Tabs.Screen 
                name="Upload" 
                options={{
                    headerShown: false,
                    // tabBarStyle: { display: "none" },
                    tabBarIcon: ({focused, color, size}) => (
                        <Ionicons name={focused ? "cloud-upload" : "cloud-upload-outline"} color={color} size={size} />                    
                    ),
                    // headerRight: () => (
                    //     <TouchableOpacity
                    //         onPress={() => {navigation.setParams({action: "DoUpload"})}}
                    //         title="Do upload"
                    //       />
                    //     ),
                }}
            >
                {() => <StackNavFactory screenName="Upload" />}
            </Tabs.Screen> 

            <Tabs.Screen 
                name="QRScan" 
                component={QRScan} 
                options={{
                    headerShown: true,                 
                    tabBarIcon: ({focused, color, size}) => (
                        <Ionicons name={focused ? "qr-code" : "qr-code-outline"} color={color} size={30} />
                    ),
                    // headerTitle: () => {
                    //     if(isDark) {
                    //         return (<Image style={{ maxHeight:20 }} resizeMode="contain" source={require("../assets/logo_dark.png")} />);
                    //     } else {
                    //         return (<Image style={{ maxHeight:20 }} resizeMode="contain" source={require("../assets/logo.png")} />);
                    //     }
                    // }                    
                }
            }
            >
            </Tabs.Screen> 

            <Tabs.Screen 
                name="Settings" 
                component={Settings} 
                options={{
                    headerShown: true,               
                    tabBarIcon: ({focused, color, size}) => (
                        <Ionicons name={focused ? "settings" : "settings-outline"} color={color} size={size} />
                    ),
                    // headerTitle: () => {
                    //     if(isDark) {
                    //         return (<Image style={{ maxHeight:20 }} resizeMode="contain" source={require("../assets/logo_dark.png")} />);
                    //     } else {
                    //         return (<Image style={{ maxHeight:20 }} resizeMode="contain" source={require("../assets/logo.png")} />);
                    //     }
                    // }
                }}
            >
            </Tabs.Screen>             
        </Tabs.Navigator>
    );
}