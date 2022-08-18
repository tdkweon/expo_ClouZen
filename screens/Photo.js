import React, {useState, useEffect} from "react";
import styled from "styled-components/native";
import { useWindowDimensions, useColorScheme, Image, RefreshControl, SafeAreaView } from "react-native";
import { colors } from "../colors";
import { ScrollView } from "react-native-gesture-handler";
import * as Progress from 'react-native-progress';

const Container = styled.SafeAreaView`
    flex: 1;
    background-color: red;
`;
// justify-content: center;
// align-items: center;

const Header = styled.View`
    background-color: grey;
`;

const UserAvatar = styled.Image`
`;

const Filename = styled.Text`
    color: white;

`;
// position: absolute;
// bottom: -120px;
// left: -200px;

const BottomText = styled.Text`
    color: white;
    background-color: blue;    
`;
// position: absolute;
// top: -70px;

const PhotoImage = styled.Image`
    background-color: black;    
`;
// style={{
//     resizeMode: 'center',
//     width: width,
//     height: height,
// }}
const Actions = styled.View`
`;

const Action = styled.TouchableOpacity`
`;

const Caption = styled.View`
`;

const CaptionText = styled.Text`
    color: white;
`;

const Likes = styled.Text`
    color: white;
`;

const BarView = styled.View`
    color: white;
    background-color: yellow;    
`;
// position: absolute;
// top: -70px;

// width: 100%;

// padding: 0 15px;
// flex-direction: row;
// margin-top: 20px;

const Bar = styled.View`
  margin: 10px 0;
  flex: 1;
`;

export default function Photo({navigation, route}) {
    console.log("\n####### Photo #######");
    const isDark = useColorScheme() === "dark";
    console.log('[Photo] isDark = > ', isDark);
    // console.log('[Photo] Props = > ', route);

    /* Cache Issue : Add dummy string in url with ? */
    const url = route.params.url;
    const path = route.params.path;
    // const file = url+'/file'+path
    const username = 'Username';
    const likes = 1;
    const caption = 'Caption';

    const file_url2 = 'https://pbs.twimg.com/profile_images/486929358120964097/gNLINY67_400x400.png';  
    const file_url3 = 'https://effigis.com/wp-content/uploads/2015/02/Airbus_Pleiades_50cm_8bit_RGB_Yogyakarta.jpg';//+'?random_number='+new Date().getTime();  
    const file_url4 = 'https://filesamples.com/samples/image/jpg/sample_640%C3%97426.jpg';
    const file = file_url4;

    const { width, height } = useWindowDimensions();
    const [ imageFile, setImageFile ] = useState(file);
    // const [ imageHeight, setImageHeight ] = useState(height);
    // const [refreshing, setRefreshing] = useState();
    // const [ progress, setProgress] = useState(1);



    // setImageFile(file);
    console.log('imageFile:', imageFile);
    console.log('size:', width, height);    
    // refetch();
    // useEffect(() => {
    //     console.log('DRAWING......');
    //     setImageFile(file);
    //     // Image.getSize(file, (width, height) => {
    //     //     setImageHeight(height);
    //     // });
    // }, []);

    // const doProgress = () => {
    //     setProgress(progress === 0 ? 1:0)
    // }

    // const onRefresh = async () => {
    //     setRefreshing(true);
    // //   await refetch();
    //     setImageFile(file_url4);
    //     setRefreshing(false);
    // };
    // useEffect(() => {
    //     navigation.setOptions({
    //         tabBarVisible:false,
    //         tabBarStyle: {display: 'none'}
    //     });
    // }, []);

    console.log('DRAWING......');
    return (
        // <ScrollView
        //     refreshControl={
        //     <RefreshControl onRefresh={onRefresh} refreshing={refreshing} />
        //     }
        //     style={{ backgroundColor: "black" }}
        //     contentContainerStyle={{
        //     backgroundColor: "black",

        //     alignItems: "center",
        //     justifyContent: "center",
        //     }}
        // >        
            <Container>
                <Header>
                    {/* <UserAvatar /> */}
                    <Filename>{imageFile}</Filename>
                </Header>
                <PhotoImage 
                    // width={width}
                    // height={height}
                    // key={new Date()}
                    onLoad={() => {
                        // setRefreshing(false);
                        console.log('<= loaded image!!!!')
                    }}
                    onLoadStart={() => {
                        // setRefreshing(true);
                        console.log('load starting =>')
                    }}
                    resizeMode='contain'
                    style={{
                        resizeMode: 'center',
                        width: width,
                        height: height,
                    }}

                    source={{
                        uri: imageFile,//+'?random_number='+new Date().getTime(),
                        // cache: "reload",
                        method: "GET",
                        headers: {
                            "Cache-Control": "no-cache",
                            "Content-Type": "application/octet-stream",
                            "cz-api-arg": JSON.stringify({'cmd': 'getFile', 'path': path })
                        },
                    }}/>
                    {/* source={{
                        uri: file,
                    }}/> */}
                <BarView>
                    {/* <Bar>
                        <Progress.Bar progress={0.3} width={200} />
                        <Progress.Bar
                            backgroundColor="red"
                            width={100} height={8} 
                            borderRadius={6} 
                            useNativeDriver/>
                    </Bar> */}
                </BarView>
                {/* <Actions>
                    <Action />
                    <Action />
                </Actions> */}
                {/* <Likes>{likes === 1 ? '1 like': `${likes} likes`}</Likes> */}
                <Caption>
                    <BottomText>{username}</BottomText>
                    {/* <CaptionText>{file}</CaptionText> */}
                </Caption>
            </Container>
    //    </ScrollView>
    );
}
