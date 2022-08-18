import React, {useRef, useState}  from "react";
import { Text, View, Button, TouchableOpacity, useColorScheme,StyleSheet } from "react-native";
import { Video, AVPlaybackStatus } from 'expo-av';
import styled from "styled-components/native";
import { colors } from "../colors";

const Container = styled.View`
    background-color: ${(props) => (props.isDark? colors.dark.screenBackground : colors.light.screenBackground)};
`;

const Filename = styled.Text`
    color: ${(props) => (props.isDark? colors.dark.screenSubText : colors.light.screenSubText)};
`;


export default function Movie({        
    navigation,
    route
    }) {
    const video = useRef(null);
    const [status, setStatus] = useState({});

    console.log("\n####### Movie #######");
    const isDark = useColorScheme() === "dark";
    console.log('[Movie] isDark = > ', isDark);
    // console.log('[Movie] navigation = > ', navigation);
    console.log('[Movie] Props = > ', route);
    

    /* Cache Issue : Add dummy string in url with ? */
    const path = route.params.path;
    const url = route.params.url;

    const file_url = url+'/file'+'?random_number='+new Date().getTime();  
    const file = path;
    console.log('[Photo] BASE_URL = > ', file_url);
    console.log('[Photo] file = > ', file);    
    return (
        <View style={styles.container}>
            <Video
                ref={video}
                style={styles.video}
                source={{
                uri: 'https://d23dyxeqlo5psv.cloudfront.net/big_buck_bunny.mp4',
                }}
                // source={{
                //     uri: file_url,
                //     method: "GET",
                //     headers: {
                //         "Content-Type": "application/octet-stream",
                //         "cz-api-arg": JSON.stringify({'cmd': 'getFile', 'path': path })
                //     },
                // }}                 
                useNativeControls
                resizeMode="contain"
                isLooping
                onPlaybackStatusUpdate={status => setStatus(() => status)}
            />
            <View style={styles.buttons}>
                <Button
                title={status.isPlaying ? 'Pause' : 'Play'}
                onPress={() =>
                    status.isPlaying ? video.current.pauseAsync() : video.current.playAsync()
                }
                />            
            {/* <Filename isDark={isDark}>{path}</Filename> */}
            {/* <Video
                ref={video}
                style={styles.mediaPlayer}
                source={{
                    uri:
                    'https://assets.mixkit.co/videos/download/mixkit-countryside-meadow-4075.mp4',
                }}
                // source={{
                //     uri: file_url,
                //     method: "GET",
                //     headers: {
                //         "Content-Type": "application/octet-stream",
                //         "cz-api-arg": JSON.stringify({'cmd': 'getFile', 'path': path })
                //     },
                // }}                
                useNativeControls
                resizeMode="contain"
                isLooping
                onPlaybackStatusUpdate={status => setStatus(() => status)}
            />
            <View style={styles.buttons}>
            <Button
                title={status.isPlaying ? 'Pause' : 'Play'}
                onPress={() =>
                status.isPlaying ? video.current.pauseAsync() : video.current.playAsync()
                }
            /> */}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      backgroundColor: '#ecf0f1',
    },
    video: {
      alignSelf: 'center',
      width: 320,
      height: 200,
    },
    buttons: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
    },
  });
  