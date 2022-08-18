import React, {useState} from "react";
import { Text, View, TouchableOpacity, StyleSheet } from "react-native";
import DynamicTabView from "react-native-dynamic-tab-view";
import Explorer from "../screens/Explorer";

// const routes = [];

export default function ExplorerDynamic({
    navigation,
    route
    }) {
    // console.log('[ExplorerDynamic] navigation = > ', navigation);
    console.log('[ExplorerDynamic] route = > ', route);
    const path = route.params.path;
    const url = route.params.url;
    const index = route.params.index;
    
    // const [index, setIndex] = React.useState(0);
    // const [routes, setRoutes] = React.useState(rarityRoutes);

    // const [tabs, setTabs] = useState([]);
    // const tabs = [
    //     { title: 'Tab1', key: 'item1' },
    //     { title: 'Tab2', key: 'item2' },
    //     { title: 'Tab3', key: 'item3' },
    // ];

    // const defaultIndex = index;
    
    const tabs = route.params.tabs;

    // setTabs(tabs => [...tabs, newTab]);
    console.log("[ExplorerDynamic] tabs:", tabs);
    console.log("[ExplorerDynamic] index:", index);

    const onChangeTab = index => {
        console.log("[ExplorerDynamic] onChangeTab:", index);
    };

    const _renderItem = (item, index) => {
        console.log("[ExplorerDynamic:_renderItem] item => ", item);
        console.log("[ExplorerDynamic:_renderItem] index => ", index);
        onChangeTab(index);
        return (
            <Explorer  navigation={navigation} route={route} url={url} path={path} tabs={tabs}>                
            </Explorer>
        );
    };

    return (
        <DynamicTabView
            data={tabs}
            renderTab={_renderItem}
            defaultIndex={index}
            containerStyle={styles.container}
            headerBackgroundColor={'white'}
            headerTextStyle={styles.headerText}
            onChangeTab={onChangeTab}
            headerUnderlayColor={'blue'}
      />
    );
}

/*
DynamicTabView.defaultProps = {
  defaultIndex: 0,
  containerStyle: {},
  tabContainerStyle: {},
  headerContainerStyle: {},

  //styles for header
  headerTextStyle: {},
  highlightStyle: {},
  noHighlightStyle: {}
};

DynamicTabView.propTypes = {
  onChangeTab: PropTypes.func,
  styleCustomization: PropTypes.object,
  containerStyle: PropTypes.any,
  tabContainerStyle: PropTypes.any,
  headerContainerStyle: PropTypes.any,
  //header style props
  headerBackgroundColor: PropTypes.any,
  headerTextStyle: PropTypes.any,
  headerActiveTextStyle: PropTypes.any,
  highlightStyle: PropTypes.any,
  noHighlightStyle: PropTypes.any,
  headerUnderlayColor: PropTypes.any,
};
*/
const styles = StyleSheet.create({
    container: {
      flex: 1
    },
    // `headerContainer: {
    //   marginTop: 16
    // },`
    headerText: {
      color:'black'
    },
    // tabItemContainer: {
    //   backgroundColor: "#cf6bab"
    // }
  });