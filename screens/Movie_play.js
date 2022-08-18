// React Native Video Library to Play Video in Android and IOS
// https://aboutreact.com/react-native-video/

// import React in our code
import React, {useState, useRef} from 'react';

// import all the components we are going to use
import {SafeAreaView, StyleSheet, Text, View, useColorScheme} from 'react-native';

//Import React Native Video to play video
import Video from 'react-native-video';

//Media Controls to control Play/Pause/Seek and full screen
import
  MediaControls, {PLAYER_STATES}
from 'react-native-media-controls';

// dv mp4 mxf mov mts mpg m2t avi (codec: xavc avc-intra 등 avc, mpeg2 prores)

const Movie = ({
        navigation,
        route
    }) => {

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

    // console.log('[MoviePlayer] Props = > ', route);
    // let path = route.params.path;
    // const url = route.params.url;
    
    /* Cache Issue : Add dummy string in url with ? */
    // const BASE_URL = url;  
    // const file = path;

    // const path1 = `/1/image/HDD/mov_1280_1_4MB.mov`;
    // const path2 = `/1/image/HDD/mov_1920_2_4MB.mov`;
    // const path3 = `/1/image/HDD/mov_480_700kB.mov`;
    // const path4 = `/1/image/HDD/mov_640_800kB.mov`;

    // path = path3;
    
    const videoPlayer = useRef(null);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [isFullScreen, setIsFullScreen] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [paused, setPaused] = useState(false);
    const [
        playerState, setPlayerState
    ] = useState(PLAYER_STATES.PLAYING);
    const [screenType, setScreenType] = useState('content');

    const onSeek = (seek) => {
        //Handler for change in seekbar
        videoPlayer.current.seek(seek);
    };

    const onPaused = (playerState) => {
        //Handler for Video Pause
        setPaused(!paused);
        setPlayerState(playerState);
    };

    const onReplay = () => {
        //Handler for Replay
        setPlayerState(PLAYER_STATES.PLAYING);
        videoPlayer.current.seek(0);
    };

    const onProgress = (data) => {
        // Video Player will progress continue even if it ends
        if (!isLoading && playerState !== PLAYER_STATES.ENDED) {
        setCurrentTime(data.currentTime);
        }
    };

    const onLoad = (data) => {
        setDuration(data.duration);
        setIsLoading(false);
    };

    const onLoadStart = (data) => setIsLoading(true);

    const onEnd = () => setPlayerState(PLAYER_STATES.ENDED);

    const onError = () => alert('Oh! ', error);

    const exitFullScreen = () => {
        alert('Exit full screen');
    };

    const enterFullScreen = () => {};

    const onFullScreen = () => {
        setIsFullScreen(isFullScreen);
        if (screenType == 'content') setScreenType('cover');
        else setScreenType('content');
    };

    const renderToolbar = () => (
        <View>
        <Text style={styles.toolbar}> toolbar </Text>
        </View>
    );

    const onSeeking = (currentTime) => setCurrentTime(currentTime);

    return (
        <View style={{flex: 1}}>
        <Video
            onEnd={onEnd}
            onLoad={onLoad}
            onLoadStart={onLoadStart}
            onProgress={onProgress}
            paused={paused}
            ref={videoPlayer}
            resizeMode={screenType}
            onFullScreen={isFullScreen}
            // source={{
            //     uri:
            //     'https://assets.mixkit.co/videos/download/mixkit-countryside-meadow-4075.mp4',
            // }}
            source={{
                uri: file_url,
                method: "GET",
                headers: {
                    "Content-Type": "application/octet-stream",
                    "cz-api-arg": JSON.stringify({'cmd': 'getFile', 'path': path })
                },
            }}
            // source={{
            //     uri: BASE_URL,
            //     method: "GET",
            //     headers: {
            //         "Content-Type": "application/octet-stream",
            //         "cz-api-arg": JSON.stringify({'cmd': 'GetFile', 'path': path })
            //     },
            // }}
            style={styles.mediaPlayer}
            volume={10}
        />
        <MediaControls
            duration={duration}
            isLoading={isLoading}
            mainColor="#333"
            onFullScreen={onFullScreen}
            onPaused={onPaused}
            onReplay={onReplay}
            onSeek={onSeek}
            onSeeking={onSeeking}
            playerState={playerState}
            progress={currentTime}
            toolbar={renderToolbar()}
        />
        </View>
    );
    };

export default Movie;

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    toolbar: {
        marginTop: 30,
        backgroundColor: 'white',
        padding: 10,
        borderRadius: 5,
    },
    mediaPlayer: {
        position: 'absolute',
        top: 0,
        left: 0,
        bottom: 0,
        right: 0,
        backgroundColor: 'black',
        justifyContent: 'center',
        // height: '100%',
        // flex: 1,    
        // alignSelf: 'center',
    },
    });