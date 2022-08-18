import React, { useEffect, useLayoutEffeect } from "react";
import { View, Text, Image, TouchableOpacity, useColorScheme} from "react-native";
import styled from "styled-components/native";
import {Ionicons, AntDesign} from "@expo/vector-icons";
import { colors } from "../colors";
/*
   Async Storage, Local Storage only save string.
   
 */
/* Screen 간 data 전달 방법
   https://reactnavigation.org/docs/navigation-prop/
*/
// const colors = {
//     bgColor: "#F2FAF4",
//     textColor: "#291E5F",
//     cardColor: "#f7f1e3",
//     btnColor: "#291E5F",
// };

// background-color: ${(props)=> props.theme.mainBgColor};
const Container = styled.ScrollView`
    padding: 3px 0px;
`;

// const Icon = styled(AntDesign)`
//     font-size: 24px;
//     margin-right: 10px;
// `;

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
`;
const Message = styled.Text`
  font-size: 18px;
`;
const Separator = styled.View`
  height: 1px;
`;

const AddButton = styled.TouchableOpacity`
    background-color: lightgrey;
    height: 80px;
    width: 80px;
    border-radius: 40px;
    elevation: 5;
    box-shadow: 1px 1px 5px rgba(0,0,0,0.3);
    justify-content: center;
    align-items: center;

    position: absolute;
    right: 30px;
    bottom: 10px;
`;

const AddText = styled.Text`
    color:  ${(props) => (props.isDark? colors.dark.screenMainText : colors.light.screenMainText)};
`;

// navigation.navigate("Upload", { path: path, url: url, selected:selected });
const Upload = ({
        navigation,
        route: {params},
        // params
    }) => {
    console.log("\n####### Upload #######");
    // Need to fix double "PATH" in props !!!!!!!!!!!!!!!!
    console.log('[Upload] navigation = ', navigation);
    console.log('[Upload] params = ', params);
    // console.log('[Upload] params = ', params.selected);
    // console.log('[Upload] params = ', params.selected.length);
    // console.log('[Upload] navigation action = ', navigation.getParam('action'));

    const isDark = useColorScheme() === "dark";
    const dir = "/3/DCIM";
    let title = "Uploading List (0)"
    if (params){
        title = `Uploading List (${params.selected.length})`;
    }
    const upList = {
        "target":"/1/TAINER/2022.04.05.sceano",
        "source": dir,
    };

    // useLayoutEffeect(() => {
    //     navigation.SetOptions({
    //         headerRight: () => (
    //             <TouchableOpacity
    //                 onPress={() => {alert("HIHI")}}
    //                 title="Do upload"
    //               />
    //             ),
    //     })
    // },[navigation]);

    useEffect(() => {
        console.log('[Upload] params = ', params);

        navigation.setOptions({
            headerLeft: (props) => (               
                Platform.OS === "android" ?
                    <TouchableOpacity {...props} onPress={() => navigation.navigate("Home")}>
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
        });

        if (params && params.selected.length >= Number(1))
        {
            navigation.setOptions({
                // title: "path" in params ? params.path : "Unknown",
                title: title,
                headerRight: () => (
                    <TouchableOpacity onPress={()=>uploadList()} title="Upload">
                        <Ionicons name="cloud-upload-outline" color="black" size={24} style={{marginTop: 10, marginEnd: 10,
                        color: isDark ? colors.dark.screenMainText : colors.light.screenMainText}}/>
                    </TouchableOpacity>
                  ),  
            });
        };
        
    }, []);

        
    const CustomHeaderBackImage = () => (
        <View style={{ flexDirection: "row", justifyContent: "center", alignItems: "center", marginLeft: 4 }}>
            <Image source={isDark ? require("../assets/back.png") : require("../assets/back_black.png")} style={{ width: 20, height: 20 }} />
        </View>
    );


    const uploadList = async ()=> {
        console.log('[Upload] uploadList', params.selected);
        const response = await (
            await fetch(
                //BASE_URL+'/dev',            
                params.url+'/dev',
                {
                    method: "POST",                    
                    headers:{"Content-Type": " application/json",
                            "cz-api-arg": JSON.stringify({'cmd': 'uploadList'})},
                    data: JSON.stringify(params.selected),
                },
            )
        ).json();
        console.log('[Upload] response = ', response);
        // setLoading(false);
    };


    // console.log('LENGTH=',params.selected.length >= Number(1));
    return (
        params && params.selected.length >= Number(1) ?
        (
            <View style={{flex:1}}>
                <Container  style={{ 
                    // width: "100%",
                    // padding: 20,
                    // marginVertical: 10,
                    // marginHorizontal: 10,
                    backgroundColor: isDark ? colors.dark.screenBackground : colors.light.screenBackground
                }}>                
                    {params.selected.map((item) => (
                        <Record 
                            key={item.name}
                            // style={{
                            //     height: 5,
                            //     backgroundColor: 'red',                            
                            // }}
                            // // width={cardWidth}
                            // // height={cardHeight}
                            // onPress={() => goFile(item)}
                            style={{ 
                                // width: "100%",
                                // padding: 20,
                                // marginVertical: 10,
                                // marginHorizontal: 10,
                                backgroundColor: isDark ? 'rgba(13,13,13,255)' : 'rgba(256,256,256,255)'
                            }}
                        >
                            {/* {item.status === "READY" ? (<Icon name="lan-connect" color="black" size={20} paddingRight={20} />) : 
                                (<Icon name="lan-disconnect" color="black" size={20} marginRight={20} />)} */}
                            <Message style={{ 
                                    color: isDark ? colors.dark.screenMainText : colors.light.screenMainText
                                }}>
                                {item.name}
                            </Message>                                      
                        </Record>

                    ))}     
                    
                </Container>
                <AddButton isDark={isDark} onPress={() => navigation.navigate("Notes")}>
                    <Ionicons name="add" color="black" size={40}/>
                    {/* <AddText>Notes</AddText> */}
                </AddButton>
            </View>
        ) : (<View><Text>No data</Text></View>)    
    );
};

export default Upload;