import React, { useRef, useEffect } from "react";
import { useForm } from "react-hook-form";
import AuthLayout from "../components/auth/AuthLayout";
import AuthButton from "../components/auth/AuthButton";
import { TextInput } from "../components/auth/AuthShared";

export default function CreateAccount() {
    const {register, handleSubmit, setValue} = useForm();
    const lastnameRef = useRef();
    const usernameRef = useRef();
    const emailRef = useRef();
    const passwordRef = useRef();
    const onNext = (nextOne) => {
        nextOne?.current?.focus();
    };

    const onValid = (data) => {
        console.log(data);
    };

    /* useEffect는 only 한번 또는 register가 변할때 실행 */
    useEffect(() => {
        register("firstname", {
            required: true,
        });
        register("lastname", {
            required: true,
        });
        register("username", {
            required: true,
        });
        register("email", {
            required: true,
        });
        register("password", {
            required: true,
        });
    }, [register]);

    return (
        <AuthLayout>
            <TextInput
                autoFocus
                placeholder="First Name"
                placeholderTextColor="gray"
                returnKeyType="next"
                // style={{ backgroundColor: "white", width: "100%" }}
                onSubmitEditing={() => onNext(lastnameRef)}
                onChangeText={(text) => setValue("firstname", text)}
            />
            <TextInput
                ref={lastnameRef}
                placeholder="Last Name"
                placeholderTextColor="gray"
                returnKeyType="next"
                onSubmitEditing={() => onNext(usernameRef)}
                onChangeText={(text) => setValue("lastname", text)}
            />
            <TextInput
                ref={usernameRef}
                placeholder="Username"
                placeholderTextColor="gray"
                returnKeyType="next"
                autoCapitalize={"none"}
                onSubmitEditing={() => onNext(emailRef)}
                onChangeText={(text) => setValue("username", text)}
            />
            <TextInput
                ref={emailRef}
                placeholder="Email"
                placeholderTextColor="gray"
                keyboardType="email-address"
                returnKeyType="next"
                onSubmitEditing={() => onNext(passwordRef)}
                onChangeText={(text) => setValue("email", text)}
            />
            <TextInput
                ref={passwordRef}
                placeholder="Password"
                placeholderTextColor="gray"
                lastOne={true}
                secureTextEntry
                returnKeyType="done"
                onSubmitEditing={handleSubmit(onValid)}
                onChangeText={(text) => setValue("password", text)}
            />                                                            
            <AuthButton 
                text="Create Account" 
                disabled={false} 
                onPress={handleSubmit(onValid)} 
            />
        </AuthLayout>
    );
}