// export default function Photo() {
//     /* Home 화면에 필요한 parameters를 QRScan에서 받음 */
//     // console.log(route );
//     const isDark = useColorScheme() === "dark"; 
//     return (
//         <View
//             style={{
//                 backgroundColor: isDark ? "black": "rgb(250, 250, 250)",
//                 flex: 1,
//                 alignItems: "center",
//                 justifyContent: "center"
//             }}
//         >
//             <Text style={{color: isDark ? "white" : "black"}}>Photo</Text>
//         </View>
//     );
// }

import React from "react";
// import PropTypes from "prop-types";
import styled from "styled-components/native";
// import { ActivityIndicator, RefreshControl, TouchableOpacity, Button, Text, Image } from "react-native";
import { useWindowDimensions, useColorScheme, Image, Text } from "react-native";
import { colors } from "../colors";

// import FastImage from 'react-native-fast-image'
import ProressImage from 'react-native-image-progress';
// import Progress from 'react-native-progress';
import * as Progress from 'react-native-progress';

const Container = styled.View`
    background-color: ${(props) => (props.isDark? colors.dark.screenBackground : colors.light.screenBackground)};
`;

const Filename = styled.Text`
    color: ${(props) => (props.isDark? colors.dark.screenSubText : colors.light.screenSubText)};
`;

const Header = styled.View``;
const UserAvatar = styled.Image``;
const Username = styled.Text`
    color: ${(props) => (props.isDark? "white" : "black")};
`;
const File = styled.Image``;
const Actions = styled.View``;
const Action = styled.TouchableOpacity``;
const Caption = styled.View``;
const CaptionText = styled.Text`
    color: ${(props) => (props.isDark? "white" : "black")};
`;
const Likes = styled.Text`
    color: ${(props) => (props.isDark? "white" : "black")};
`;

const View = styled.View`
`;
// const Image = styled.Image`
// `;
// const Text = styled.Text`
// `;


// function Photo({ id, user, caption, file, isLiked, likes }) {
export default function Photo2({
        navigation,
        route
    }) {
    console.log("\n####### Photo #######");
    const isDark = useColorScheme() === "dark";
    console.log('[Photo] isDark = > ', isDark);
    // console.log('[Photo] navigation = > ', navigation);
    console.log('[Photo] Props = > ', route);

    /* Cache Issue : Add dummy string in url with ? */
    const path = route.params.path;
    const url = route.params.url;

    const file_url = url+'/file'+'?random_number='+new Date().getTime();  

    // const file_url2 = 'https://pbs.twimg.com/profile_images/486929358120964097/gNLINY67_400x400.png'+'?random_number='+new Date().getTime();  
    const file_url2 = 'https://effigis.com/wp-content/uploads/2015/02/Airbus_Pleiades_50cm_8bit_RGB_Yogyakarta.jpg';//+'?random_number='+new Date().getTime();  

    const file = path;
    console.log('[Photo] BASE_URL = > ', file_url);
    console.log('[Photo] file = > ', file);
    const { width, height } = useWindowDimensions();
    return (
        <Container isDark={isDark} 
            style={{flex: 1, justifyContent: 'center', alignContent: 'center',backgroundColor: 'blue',}}>
            {/* <Filename isDark={isDark}>{path}</Filename> */}
            {/* <Image style={{width: 100, height: 50, resizeMode: Image.resizeMode.contain, borderWidth: 1, borderColor: 'red'}} 
                source={{uri: 'https://pbs.twimg.com/profile_images/486929358120964097/gNLINY67_400x400.png'}}/> */}

            {/* <Filename isDark={isDark}>{file_url2}</Filename> */}
            {/* <Progress.Bar progress={0.3} width={200} /> */}
            {/* <Progress.Pie progress={0.4} size={50} />
            <Progress.Circle size={30} indeterminate={true} />
            <Progress.CircleSnail color={['red', 'green', 'blue']} /> */}

            {/* <ProressImage style={{
                width: '100%', height: undefined, aspectRatio: 1,}}
                indicator={Progress.Bar}
                indicatorProps={{
                    size: 80,
                    borderWidth: 0,
                    color: 'rgba(150, 150, 150, 1)',
                    unfilledColor: 'rgba(200, 200, 200, 0.2)'
                }}
                
                source={{
                    uri: file_url2,
                    // priority: FastImage.priority.normal,
                    }}/> */}
            <Image
                source={{
                    uri: file_url,
                    cache: "reload",
                    method: "GET",
                    headers: {
                        "Cache-Control": "no-cache",
                        "Content-Type": "application/octet-stream",
                        "cz-api-arg": JSON.stringify({'cmd': 'getFile', 'path': file })
                    },
                }}
                // indicator={Progress.Bar }
                // indicatorProps={{
                //     width: 120,
                //     height: 4,
                //     indeterminate: true,
                //     borderRadius: 2,
                //     borderWidth: 0,
                //     color: 'rgba(150, 150, 150, 1)',
                //     unfilledColor: 'rgba(200, 200, 200, 0.2)'
                // }}
                style={{width: '100%', height: undefined, aspectRatio: 1, backgroundColor: 'red',}}                
            />
        </Container>


        // </Container>
    );
}

// Photo.propTypes = {
//     id: PropTypes.number.isRequired,
//     user: PropTypes.shape({
//         avatar: PropTypes.string,
//         username: PropTypes.string.isRequired,
//     }),
//     caption: PropTypes.string,
//     file: PropTypes.string.isRequired,
//     isLiked: PropTypes.bool.isRequired,
//     likes: PropTypes.number.isRequired,
//     commentNumber: PropTypes.number.isRequired,
// };
