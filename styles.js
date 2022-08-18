import styled from "styled-components/native";
import { colors } from "./colors";

// import { Dimensions } from 'react-native';
// const deviceWidth = Dimensions.get('screen').width;
// const deviceHeight = Dimensions.get('screen').height;

const MainText = styled.Text`
  font-size: 14px;
  color: ${(props) => (props.isDark? colors.dark.screenMainText : colors.light.screenMainText)};
`;

const SubText = styled.Text`
  font-size: 12px;
  color: ${(props) => (props.isDark? colors.dark.screenMainText : colors.light.screenSubText)};
`;

const Loader = styled.View`
  flex: 1;
  background-color: ${(props) => (props.isDark? 'rgba(60,60,60,255)' : 'rgba(252,252,252,255)')};
  justify-content: center;
  align-items: center;
`;

//////////////////////////////////////////////////////////////////////////////////////////////////////////

const DeviceBox = styled.View`
    height: 80px;
    width: 80px;
    margin-top: 8px;
    margin-bottom: 2px;
`;

const DeviceName = styled.Text`
    color : ${(props) => (props.isDark? colors.dark.cardMainText : colors.light.cardMainText)};
    font-weight: 600;
    font-size: 20px;
    text-align: center;
`;

const DeviceDesc = styled.Text`
    color: ${(props) => (props.isDark? colors.dark.cardSubText : colors.light.cardSubText)};
    text-align: center;
`;

const DeviceSize = styled.Text`
    color : ${(props) => (props.isDark? colors.dark.cardMainText : colors.light.cardMainText)};
    text-align: center;
`;

const DeviceImage = styled.Image`
    flex: 1;
    width: 100%;
    height: 100%;
    resize-mode: stretch;
`;

//////////////////////////////////////////////////////////////////////////////////////////////////////////

const SettingsContainer = styled.ScrollView`
    flex: 1;
    background-color: ${(props) => (props.isDark? colors.dark.screenBackground : colors.light.screenBackground)};
`;

const Section = styled.View`
    padding:10px;
    background-color: ${(props) => (props.isDark? colors.dark.screenBackground : colors.light.screenBackground)};
`;

const SectionItem = styled.View`
    background-color: ${(props) => (props.isDark? 'rgba(60,60,60,255)' : 'rgba(252,252,252,255)')};
    padding-bottom: 8px;
    border-radius: 20px;
`;

const SettingsSeparator = styled.View`
    height: 1px;
    background-color: ${(props) => (props.isDark? colors.dark.screenSeparator : colors.light.screenSeparator)};
    width: 90%;
    align-self: center;
`;

const SectionTitle = styled.Text`
    color : ${(props) => (props.isDark? colors.dark.screenMainText : colors.light.screenMainText)};
    font-size: 24px;
    font-weight: bold;
    padding-bottom: 10px;
    justify-content: center;
    align-items: center;
`;

const SectionText = styled.Text`
    color : ${(props) => (props.isDark? colors.dark.screenMainText : colors.light.screenMainText)};
    font-size: 18px;
    padding: 4px;    
    padding-left: 10px;    
`;

const SectionDesc = styled.Text`
    color : ${(props) => (props.isDark? 'rgba(160,160,160,255)' : 'rgba(120,120,120,255)')};
    margin-left: 20px;
    font-size: 16px;    
`;

const SectionButton = styled.TouchableOpacity`
    background-color: "rgba(68,132,255,255)";
    justify-content: center;
    align-content: space-between;
    padding-vertical: 6px;
    border-radius: 16px;
    margin-horizontal: 2%;
    margin-top: 4px;
    margin-bottom: 6px;
    min-width: 45%;
    align-items: center;
`

const SettingsSubText = styled.Text`
    color : ${(props) => (props.isDark? colors.dark.screenSubText : colors.light.screenSubText)};
    text-align: center;
`;

const SettingsDescText = styled.Text`
    color : ${(props) => (props.isDark? colors.dark.screenSubText : colors.light.screenSubText)};
    text-align: center;
`;

//////////////////////////////////////////////////////////////////////////////////////////////////////////
export const AppStyles = { MainText, SubText, Loader };
export const CardStyles = { DeviceBox, DeviceName, DeviceDesc, DeviceSize, DeviceImage };
export const SettigsStyles = { SettingsContainer, Section, SectionItem, SettingsSeparator, SectionTitle, SectionText, SectionDesc, SectionButton };
