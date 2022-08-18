import React, { useRef, useEffect } from "react";
import { useForm } from "react-hook-form";
import AuthButton from "../components/auth/AuthButton";
import AuthLayout from "../components/auth/AuthLayout";
import { TextInput } from "../components/auth/AuthShared";

export default function Login() {
    const {register, handleSubmit, setValue} = useForm();
    const passwordRef = useRef();
    const onNext = (nextOne) => {
        nextOne?.current?.focus();
    };

    const onValid = (data) => {
        console.log(data);
    };

    /* useEffect는 only 한번 또는 register가 변할때 실행 */
    useEffect(() => {
        register("username", {
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
                placeholder="Username"
                placeholderTextColor="gray"
                returnKeyType="next"
                autoCapitalize={"none"}
                onSubmitEditing={() => onNext(passwordRef)}
                onChangeText={(text) => setValue("username", text)}
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
                text="Login" 
                disabled={false} 
                onPress={handleSubmit(onValid)} 
            />         
        </AuthLayout>
    );
}