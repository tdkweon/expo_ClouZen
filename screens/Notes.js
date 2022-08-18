import React, { useState } from "react";
import { Alert } from "react-native";
import styled from "styled-components/native";

const colors = {
    bgColor: "#F2FAF4",
    textColor: "#291E5F",
    cardColor: "#f7f1e3",
    btnColor: "#291E5F",
};

const View = styled.View`
    background-color: ${colors.bgColor};
    flex: 1;
    padding: 0px 30px;
`;
const Title = styled.Text`
    color: ${colors.textColor};
    margin: 20px 0px;
    text-align: center;
    font-size: 24px;
    font-weight: 400;
`;
const TextInput = styled.TextInput`
    background-color: white;
    border-radius: 20px;
    padding: 10px 20px;
    font-size: 18px;
    box-shadow: 1px 1px 3px rgba(41, 30, 95, 0.2);
`;
const Btn = styled.TouchableOpacity`
    width: 100%;
    margin-top: 20px;
    background-color: ${colors.btnColor};
    padding: 10px 20px;
    align-items: center;
    border-radius: 20px;
    box-shadow: 1px 1px 3px rgba(41, 30, 95, 0.2);
`;
const BtnText = styled.Text`
    color: white;
    font-weight: 500;
    font-size: 18px;
`;

const Emotions = styled.View`
    flex-direction: row;
    justify-content: space-between;
    margin-bottom: 20px;
`;
const Emotion = styled.TouchableOpacity`
    background-color: white;
    box-shadow: 1px 1px 3px rgba(41, 30, 95, 0.2);
    padding: 10px;
    border-radius: 10px;
    border-width: 1px;
    border-color: ${(props) =>
    props.selected ? "rgba(41, 30, 95, 1);" : "transparent"};
`;
const EmotionText = styled.Text`
    font-size: 24px;
`;

const emotions = ["🤯", "🥲", "🤬", "🤗", "🥰", "😊", "🤩"];

const Notes = () => {
    const [selectedEmotion, setEmotion] = useState(null);
    const [feelings, setFeelings] = useState("");
    const onChangeText = (text) => setFeelings(text);
    const onEmotionPress = (face) => setEmotion(face);
    const onSubmit = () => {
        if (feelings === "" || selectedEmotion == null) {
        return Alert.alert("Working on....");
        }
    };
    return (
        <View>
        <Title>Take notes for upload</Title>
        {/* <Emotions>
            {emotions.map((emotion, index) => (
            <Emotion
                selected={emotion === selectedEmotion}
                onPress={() => onEmotionPress(emotion)}
                key={index}
            >
                <EmotionText>{emotion}</EmotionText>
            </Emotion>
            ))}
        </Emotions> */}
        <TextInput
            returnKeyType="done"
            onSubmitEditing={onSubmit}
            onChangeText={onChangeText}
            value={feelings}
            multiline
            numberOfLines={8}
            textAlignVertical={'top'}
            placeholder="Write your comments..."
        />
        <Btn onPress={onSubmit}>
            <BtnText>Save</BtnText>
        </Btn>
        </View>
    );
};
export default Notes;