// React Native Popup Menu – Over Flow Menu
// https://aboutreact.com/react-native-popup-menu/
 
import React, {useState} from 'react';
//import react in our code.
import {View, Text, Image, TouchableOpacity } from 'react-native';
//import all the components we are going to use.
import Menu, {MenuItem, MenuDivider} from 'react-native-material-menu';
//import menu and menu item

export default function ExplorerMenu() {
  const [visible, setVisible] = useState(false);

  const hideMenu = () => setVisible(false);

  const showMenu = () => setVisible(true);
    console.log('Menu', Menu);

  return (
    <View style={{ height: '100%', alignItems: 'center', justifyContent: 'center' }}>
      {/* <Menu
        visible={visible}
        anchor={<Text onPress={showMenu}>Show menu</Text>}
        onRequestClose={hideMenu}
      >
        <MenuItem onPress={hideMenu}>Menu item 1</MenuItem>
        <MenuItem onPress={hideMenu}>Menu item 2</MenuItem>
        <MenuItem disabled>Disabled item</MenuItem>
        <MenuDivider />
        <MenuItem onPress={hideMenu}>Menu item 4</MenuItem>
      </Menu> */}
    </View>
  );
}

// export default function ExplorerMenu (props) {
//     let _menu = null;
    
//     return (
//         // <View style={props.menustyle}>
//         <View>
//             <Menu
//                 ref={(ref) => (_menu = ref)}
//                 button={
//                 props.isIcon ? (
//                     <TouchableOpacity onPress={() => _menu.show()}>
//                     <Image source={props.isDark ? require("../assets/back.png") : require("../assets/back_black.png")} style={{ width: 30, height: 30 }} />
//                     </TouchableOpacity>
//                 ) : (
//                     <Text
//                         onPress={() => _menu.show()}
//                         style={props.textStyle}
//                     >
//                         meuTexxt {/*{props.menutext} */}
//                     </Text>
//                 )
//             }>
//                 <MenuItem
//                     onPress={() => {
//                     //   props.navigation.navigate('SecondPage');
//                     _menu.hide();
//                     }}>
//                     Go to second Page
//                 </MenuItem>
//                 <MenuItem
//                     onPress={() => {
//                     //   props.navigation.navigate('FirstPage');
//                     _menu.hide();
//                     }}>
//                     Go to first Page
//                 </MenuItem>
//                 <MenuItem
//                         onPress={() => {
//                             _menu.hide();
//                         }}>
//                         Demo Option
//                 </MenuItem>
//                 <MenuItem disabled>Disabled option</MenuItem>
//                 <MenuDivider />
//                 <MenuItem
//                     onPress={() => {
//                         _menu.hide();
//                     }}>
//                     Option After Divider
//                 </MenuItem>
//             </Menu>
//         </View>
//     );
// };

