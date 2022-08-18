import React, { useState, useEffect } from "react";
import styled from "styled-components/native";
import { useQuery } from "react-query";
import { ActivityIndicator, RefreshControl, TouchableOpacity, View, Image, Text, Alert, useColorScheme } from "react-native";
// import DeviceView from "../components/DeviceView";
import { Api } from "../api";
import {Ionicons, AntDesign } from "@expo/vector-icons";
import Checkbox from 'expo-checkbox';
import { colors } from "../colors";
import ExplorerMenu from "../components/ExplorerMenu";

// background-color: ${(props) => (props.isDark? "white" : "white")};
const FileContainer = styled.FlatList`
    padding: 3px 0px;
`;
const Record = styled.View`
    background-color: ${(props) => (props.isDark? colors.dark.screenBackground : colors.light.screenBackground)};
    flex-direction: row;
    align-items: center;
    padding: 10px 20px;
    border-radius: 20px;
`;
const Icon = styled(AntDesign)`
    font-size: 24px;
    margin-right: 10px;
    color: ${(props) => (props.isDark? colors.dark.screenSubText : colors.light.screenSubText)};
`;
const Message = styled.Text`
  font-size: 18px;
`;
const Separator = styled.View`
  height: 1px;
`;
const Loader = styled.View`
    flex: 1;
    justify-content: center;
    align-items: center;
`;


export default function Explorer({ navigation, route }) {
    console.log("\n####### Explorer #######");
    const isDark = useColorScheme() === "dark";
    const path = route.params.path;
    const url = route.params.url;

    console.log('[Explorer] isDark = > ', isDark);
    console.log('[Explorer] path = > ', path);
    console.log('[Explorer] url = > ', url);

    const [refreshing, setRefreshinig] = useState(false);
    const [loading, setLoading] = useState(true);
    const [files, setFiles] = useState([]);
    const [selection, setSelection] = useState(false);
    const [selectionCount, setSelectionCount] = useState(0);
    const [selectedItems, setSelectedItems] = useState([]);

    let selected = [];

    console.log('[Explorer] loading = > ', loading);
    // console.log('[Explorer] files = > ', files);

    // useLayoutEffect(() => {
    //     navigation.setOptions({
    //         headerRight: () => (
    //             <Button onPress={() => setCount(c => c + 1)} title="Update count" />
    //         ),
    //     });
    // }, [navigation]);

    useEffect(() => {
        /* Menu icon */
        console.log("[Explorer] useEffect");
        const indexOfFirst = path.indexOf("/");        
        let titlePath = path.slice(path.indexOf("/", (indexOfFirst + 1)));        
        if (! titlePath.includes("/")) {
            titlePath = '/';
        }
        console.log("[Explorer] ", titlePath);


        navigation.setOptions({
            // headerTitleStyle: { maxWidth: 250, },            
            title:titlePath,
            headerTitleAlign: "left",
            headerLeft: (props) => (               
                Platform.OS === "android" ?
                    <TouchableOpacity {...props}>
                        <View style={{ flexDirection: "row", justifyContent: "flex-start", alignItems: "center", paddingLeft: 8, width: 50, height: 50 }}>
                                <CustomHeaderBackImage />
                        </View>
                    </TouchableOpacity>
                      : null
                    /* iOS */
                    // <TouchableOpacity {...props}>
                    //     <View style={{ flexDirection: "row", justifyContent: "center", alignItems: "center", marginLeft: 4 }}>
                    //         <CustomHeaderBackImage />
                    //         <Text style={{ color: "#fff", fontSize: 20 }}>Back</Text>
                    //     </View>
                    // </TouchableOpacity>
                        
            ),           
            // headerRight: () => (
            //     <ExplorerMenu
            //       //Menu Text
            //       menutext="Menu"
            //       //Menu View Style
            //       menustyle={{marginRight: 16}}
            //       //Menu Text Style
            //       textStyle={{color: 'white'}}
            //       navigation={navigation}
            //       route={route}
            //       isIcon={true}
            //       isDark={isDark}
            //     />
            //   ),  

            // headerRight: FilesMenu,
        });
        
        getAllData();

    }, []);

    /******************************************************************************************************** */
    /* Explorer Header Decoration */
    const FilesMenu = () => (
        <TouchableOpacity>
            <Ionicons name="ellipsis-vertical-outline" size={24} style={{ 
                marginTop: 10,
                marginEnd: 10,
                color: isDark ? colors.dark.screenMainText : colors.light.screenMainText
            }}></Ionicons>
        </TouchableOpacity>
    );
    
    const CustomHeaderBackImage = () => (
        <View style={{ flexDirection: "row", justifyContent: "center", alignItems: "center", marginLeft: 4 }}>
            <Image source={isDark ? require("../assets/back.png") : require("../assets/back_black.png")} style={{ width: 20, height: 20 }} />
        </View>
    );


    /******************************************************************************************************** */
    /* Home 화면에 필요한 모든 Data를 가져옴 */
    const getAllData = async () => {
        console.log("[Explorer] getAllData");
        // await Promise.all([getFiles()]);
        await getFiles().catch(e => console.log('getAllData: catched e:', e));
        setLoading(false);
    };
    
    /* 화면을 아래로 내릴때 refresh 기능 */
    const onRefresh = async() =>
    {        
        console.log("[Explorer]Refrshing...");
        setRefreshinig(true);
        await getFiles().catch(e => console.log('onRefresh: catched e:', e));
        // getFiles();
        setRefreshinig(false);
    };
    
    // const getFiles = () => {
    //     console.log("2. getFiles ==> start", path);
    //     try {
    //         const response = Api.fetchWithTimeout(
    //             url+'dev',                
    //             {
    //                 method: "GET",
    //                 headers:{"cz-api-arg": JSON.stringify({'cmd': 'FileList', 'path': path })},
    //                 timeout: 3000 
    //             },
    //         );
    //         console.log('response', response.dir[path]);
    //         if (response.dir[path]){
    //             /* sort */
    //             //let sortedFiles = response.dir[path].sort((a, b) => (a.name.localeCompare(b.name)) && (a.flags === 1) ? 1: -1);
    //             let sortedFiles = response.dir[path].sort((a, b) => (a.flags === 1) ? 1: -1);
    //             //let sortedFiles2 = response.dir[path].sort((a, b) => (a.name.localeCompare(b.name)) ? 1: -1);
    //             // console.log("[Explorer] Sorted = ",sortedFiles);
    //             const modifiedData = sortedFiles.map((item) => { return {...item, checked:false}; });
    //             // const modifiedData = (response.dir[path]).map((item) => { return {...item, checked:false}; });
    //             setFiles({[path]:modifiedData});
    //             console.log('[Explorer] getFiles : modified response.dir=',{[path]:modifiedData});    
    //         } else {
    //             setFiles({[path]:[]});
    //         }
                       
    //         // console.log('[Explorer] getFiles : modified response.dir=',{modifiedData});      
             
    //         // setFiles(response.dir);
    //         console.log('[Files] getFiles : response.dir=',response.dir);      
    //         setLoading(false);
    //     }catch(e) {
    //         //setFiles({[path]:[]});
    //         console.error(e);
    //         // 연결 오류 메세지
    //         Alert.alert(
    //             "Connection Error",
    //             "Cannot fetch data from a device\nPlease check connection",
    //             [{ text: "Close", }]
    //         );            
    //         throw Error('2. getFiles: Fetch Error');
    //     } finally {
    //         console.log('2. getFiles from remote');
    //     }
    // };  

    const getFiles = async () => {
        console.log("2. getFiles ==> start", path);
        try {
            const response = await (
                await Api.fetchWithTimeout(
                    url+'/dev',                
                    {
                        method: "GET",
                        headers:{"cz-api-arg": JSON.stringify({'cmd': 'FileList', 'path': path })},
                        timeout: 3000 
                    },
                )
            ).json();
            // console.log('response', response.dir[path]);
            if (response.dir[path]){
                /* sort */
                //let sortedFiles = response.dir[path].sort((a, b) => (a.name.localeCompare(b.name)) && (a.flags === 1) ? 1: -1);
                let sortedFiles = response.dir[path].sort((a, b) => (a.flags === 1) ? 1: -1);
                //let sortedFiles2 = response.dir[path].sort((a, b) => (a.name.localeCompare(b.name)) ? 1: -1);
                // console.log("[Explorer] Sorted = ",sortedFiles);
                const modifiedData = sortedFiles.map((item) => { return {...item, checked:false}; });
                // const modifiedData = (response.dir[path]).map((item) => { return {...item, checked:false}; });
                setFiles({[path]:modifiedData});
                // console.log('[Explorer] getFiles : modified response.dir=',{[path]:modifiedData});    
            } else {
                setFiles({[path]:[]});
            }
                       
            // console.log('[Explorer] getFiles : modified response.dir=',{modifiedData});      
             
            // setFiles(response.dir);
            // console.log('[Files] getFiles : response.dir=',response.dir);      
            setLoading(false);
        }catch(e) {
            //setFiles({[path]:[]});
            console.log('getFiles',e);
            // 연결 오류 메세지
            Alert.alert(
                "Connection Error",
                "Cannot fetch data from a device\nPlease check connection",
                [{ text: "Close", }]
            );            
            // throw Error('2. getFiles: Fetch Error');
        } finally {
            console.log('2. getFiles from remote');
        }
    };  


    const onPress = (name, flags) => {
        console.log("[Explorer] onPress", name, flags);

        const newPath = path+'/'+name;
        if (flags === 0){
            console.log('[Explorer] onPress : newPath=', newPath);
            /* Static */
            navigation.push("Explorer", { path: newPath, url: url });     

            /* Dynamic */
            // tabs.push({ title: newPath, key: newPath });
            // console.log("[Explorer] ** tabs = ", tabs);
            // console.log("[Explorer] ** index = ", (tabs.length-1));

            // navigation.navigate("ExplorerDynamic", { path: newPath, url: url, index: (tabs.length - 1), tabs:tabs });

        } else {
            console.log('[Explorer] onPress : File=', newPath);
            var fileExt = newPath.split('.').pop().toLowerCase();
            console.log('[Explorer] Ext=', fileExt);
            if (fileExt === 'png' || fileExt === 'bmp' || fileExt === 'jpg' || fileExt === 'gif' ){
                console.log('[Explorer] go Picture');
                navigation.navigate("Photo", { path: newPath, url: url });
            } else if (fileExt === 'mov' || fileExt === 'mp3' || fileExt === 'mp4'){
                console.log('[Explorer] go Move');
                navigation.navigate("Movie", { path: newPath, url: url });
            } else { 
                console.log('[Explorer] Alert');
                Alert.alert(
                    "Alert Title",
                    "Cannot play",
                    [{
                        text: "Cancel",
                        onPress: () => console.log("Cancel Pressed"),
                        style: "cancel"
                    }]
                );
            }
        }        
    };

    const onPressSelection = (name) => {
        console.log("[Explorer] onPressSelection", name);

    };

    const onLongPress = (item) => {
        // console.log('STARTED LONG PRESS = ', item)
        // console.log('selection = ', selection)

        // const data = files[path];
        // console.log(data);
        // console.log(data.find((element) => {
        //     element.name === item.name;
        // }));
        
        onChecked(path, item);
        setSelection(!selection); // re-render
    };
    
    const SearchItem = (path, item) => {
        // const foundItems = realm
        //     .objects("UploadList")
        //     .filtered("path = 'path'");
        // console.log("foundItem=", foundItems);

        // if (foundItems) {
        //     const foundItem = realm
        //         .objects("UploadItem")
        //         .filtered("path = 'path'");
        //     console.log("foundItem=", foundItem);
        // }
        return false;
    };

    const onChecked = (path, item) => {
        console.log('[Explorer:onChecked] path = ', path);
        console.log('[Explorer:onChecked] item.name = ', item.name);


        // query realm for all instances of the "Task" type.
        // const uplist = realm.objects("UploadList");
        // console.log(`The lists of UploadList are: ${uplist.map((aItem) => aItem.note)}`);

        const data = files[path];
        // console.log('DATA ==========',data);
        // console.log('DATA ==========',item.name);
        let found = data.find(element => element.name === item.name);
        console.log('FOUND ==========',found);

        found.checked = !found.checked;
        if (found.checked) {
            setSelectionCount(selectionCount+1);           
        } else {
            setSelectionCount(selectionCount-1);
        }
        console.log("[Explorer:onChecked] Count=", selectionCount);
        const selectedList = getSelectedItems();
        
        /******************************* */
        // 확인 필요 
        if ( selectionCount >= 0){ 
            /* Create Upload Button */
            // console.log('[Explorer:onChecked] setOptions:', found);
            // console.log(navigation);
            navigation.setOptions({
                // title:"TEST!!!!",
                headerRight: () => (
                  <TouchableOpacity onPress={()=>goUpload(selectedList)} title="Upload">
                      <Ionicons 
                        name="cloud-upload-outline"                           
                        size={24} style={{marginTop: 10, marginEnd: 10,
                            color: isDark ? colors.dark.screenMainText : colors.light.screenMainText
                        }}
                    />
                  </TouchableOpacity>
                ),
              });
        };

        /* 
        1. check item is selected already or not
        2. 
        */

        // found = SearchItem(path, item);

        // if (found) {// && item.checked) {
        //     // realm.write(() => {
        //     //     const uploadItem = realm.create("UploadList", {
        //     //         _id: Date.now(),
        //     //         item: item,
        //     //         note: name,
        //     //     });
        //     //     console.log(uploadItem);
        //     // });
        //     console.log(item, "Found");
        // } else {
        //     console.log(item, "Not found");
        // }
    };

    const getSelectedItems = () => {
        console.log("[Explorer:getSelectedItems] #####");
        const data = files[path];
        
        for (let i=0; i<data.length;i++){
            if (data[i].checked === true){
                // let clone = {};
                // clone["flags"] = data[i]["flags"];
                // clone["name"] = data[i]["name"];
                selected.push(data[i]);
            };
        };
        //goUpload(selected);
        console.log("[Explorer:getSelectedItems] #####",selected);
        return selected;
    };

    const goUpload = (selected) => {
        console.log("[Explorer] Upload pressed!!!");
        console.log("[Explorer] Upload pressed!!!",selected);
        // navigation.navigate("Upload", { path: path, url: url, selected:selected });

        navigation.navigate("Upload", {
            screen: "UploadScreen",
            params: { path: path, url: url, selected:selected }});        
        // navigation.navigate("Tabs", {
        //     screen: "Upload",
        //     params: {
        //         url,
        //         path,
        //         selected,
        //         // selected : {path:selected},
        //     },
        // });
    };

    console.log('[Explorer] selectionCount:', selectionCount);
    // console.log('[Explorer] files**************:', files[path]);

    return loading || typeof files[path] === "undefined" ? (
        <Loader>
            <ActivityIndicator animating={true} size="large" style={{opacity:1}} color="#999999"  />
        </Loader>
        ) : (
        <FileContainer
            style={{ 
                // width: "100%",
                // padding: 20,
                // marginVertical: 10,
                // marginHorizontal: 10,
                backgroundColor: isDark ? colors.dark.screenBackground : colors.light.screenBackground
            }}
            onRefresh={onRefresh} 
            refreshing={refreshing}
            data={Object.values(files[path])}
            keyExtractor={(item) => item.name}
            ItemSeparatorComponent={Separator}
            renderItem={({item}) => ( 
                
                <TouchableOpacity 
                    onPress={() => {
                        selection ? onPressSelection(item.name) : 
                                    onPress(item.name, item.flags)}
                    }
                    onLongPress={ () => onLongPress(item)}
                >
                    <Record style={{ 
                            // width: "100%",
                            // padding: 20,
                            // marginVertical: 10,
                            // marginHorizontal: 10,
                            backgroundColor: isDark ? 'rgba(13,13,13,255)' : 'rgba(256,256,256,255)'
                        }}>
                        {selection ? (
                                <Checkbox
                                    style={{
                                        marginRight: 10,
                                        // backgroundColor: "blue",
                                    }}
                                    disabled={false}
                                    value={item.checked}
                                    onValueChange={() => onChecked(path, item)}
                                />
                            ):(null)}
                        {item.flags === 0 ? (<Icon name="folder1" color="black" size={20} paddingRight={20} />) : 
                            (<Icon name="file1" size={20} marginRight={20} />)}
                        <Message
                            style={{ 
                                color: isDark ? colors.dark.screenMainText : colors.light.screenMainText
                            }}
                        >{item.name}</Message>
                    </Record>
                </TouchableOpacity>
            )}
        >
        </FileContainer>
    );
};

//     return (
//         <View>
//             <Text>Explorer</Text>
//         </View>
//     );
// }


{/* <View style={{flexDirection: "row", justifyContent: 'space-between'}}>
<SettigsStyles.SectionText style={{ backgroundColor:"blue"}}>[Homepage] </SettigsStyles.SectionText>
<TouchableOpacity  onPress={() => Linking.openURL(homepage)}>
    <SettigsStyles.SectionText style={{alignSelf: "flex-end"}}>{homepage}</SettigsStyles.SectionText>
</TouchableOpacity>
</View> */}