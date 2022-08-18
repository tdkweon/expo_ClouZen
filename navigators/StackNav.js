import { createStackNavigator } from "@react-navigation/stack";
import React from "react";
import CreateAccount from "../screens/CreateAccount";
import Explorer from "../screens/Explorer";
import Login from "../screens/Login";
import Welcome from "../screens/Welcome";

const Stack = createStackNavigator();

export default function StackNav() {
    return (
        <Stack.Navigator
            initialRouteName="Welcome"            
            screenOptions={{
                animation: 'slide_from_right',
                gestureEnabled:true,             
                headerBackTitleVisible: false,
                /* iOS: headerTitle */

                // headerTitle: false,
                /* Android: headerTitle */                   
                headerTitle: () => false,
                headerTransparent: true,
                headerTintColor: "black", // remove "<-"                
            }}
        >
            <Stack.Screen name="Welcome" 
                options={{
                    headerShown: false,
                    headerTintColor: "blue"
                }}
                component={Welcome} />
            <Stack.Screen name="CreateAccount" component={CreateAccount} 
            />

            <Stack.Screen name="Login" component={Login} 
                options={{
                    presentation: "modal"
                }}            
            />
            <Stack.Screen name="Explorer" component={Explorer} />
        </Stack.Navigator>
    );
}