import React from "react";
import styled from "styled-components/native";
import { Keyboard, TouchableWithoutFeedback } from "react-native";
import { KeyboardAvoidingView, Platform } from "react-native";

const Container = styled.View`
    flex: 1;
    align-items: center;
    justify-content: center;
    background-color: white;
    padding: 0px 40px;
`;

const Logo = styled.Image`
    max-width: 100%;
    width: 100%;
    height: 100px;
    margin-bottom: 20px;
`;

export default function AuthLayout({children}) {
    const dismissKeyboard = () => {
        Keyboard.dismiss();
      };

    return (
        <TouchableWithoutFeedback 
            style={{ flex: 1 }} 
            onPress={dismissKeyboard} 
            disabled={Platform.OS === "web"}
        >
            <Container>
                <KeyboardAvoidingView
                    style={{
                        width: "100%",                        
                    }}
                    // behavior="padding"
                    // keyboardVerticalOffset={Platform.OS === "ios" ? 50 : 0}
                >
                    <Logo resizeMode="contain" source={require("../../assets/logo.png")} />
                    {children}               
                </KeyboardAvoidingView>
            </Container>
        </TouchableWithoutFeedback>        
    );
}