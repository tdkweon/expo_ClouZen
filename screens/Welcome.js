import React, { useState, useEffect } from "react";
import { TouchableOpacity, Text } from "react-native";
import styled from "styled-components/native";
import AuthLayout from "../components/auth/AuthLayout";
import AuthButton from "../components/auth/AuthButton";
import { colors } from "../colors";
import NetInfo from '@react-native-community/netinfo';

const LoginLink = styled.Text`
    color: ${colors.blue};
    font-weight: 600;
    margin-top: 10px;
    font-size: 16px;
    text-align: center;
`;

export default function Welcome({navigation}) {
    const [netInfo, setNetInfo] = useState('');
    useEffect(() => {
        // Subscribe to network state updates
        const unsubscribe = NetInfo.addEventListener((state) => {
            setNetInfo(
            `Connection type: ${state.type}
            Is connected?: ${state.isConnected}
            IP Address: ${state.details.ipAddress}`
            );
        });

        return () => {
            // Unsubscribe to network state updates
            unsubscribe();
        };
        }, []);

        const getNetInfo = () => {
        // To get the network state once
        NetInfo.fetch().then((state) => {
            alert(
            `Connection type: ${state.type}
            Is connected?: ${state.isConnected}
            IP Address: ${state.details.ipAddress}`
            );
        });
    };

    const goToCreateAccount = () => navigation.navigate("CreateAccount");
    const goToLogin = () => navigation.navigate("Login");
    return (
        <AuthLayout>
            <AuthButton text="Create New Account" disabled={false} onPress={goToCreateAccount} />
            <TouchableOpacity onPress={goToLogin}>
                <LoginLink>Login</LoginLink>
            </TouchableOpacity>
            <TouchableOpacity >
                <LoginLink>QR Scan</LoginLink>
            </TouchableOpacity>
            
            <Text>
                React Native NetInfo
            </Text>
            <Text>
                {/*Here is NetInfo to get device type*/}
                {netInfo}
            </Text>
        </AuthLayout>
    );
}