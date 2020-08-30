import React, { Component } from 'react';
import {
  Switch,
  ScrollView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  NativeEventEmitter,
  NativeModules,
  SafeAreaView,
  FlatList,
  TouchableHighlight
} from 'react-native';
import Constants from 'expo-constants';

import { Appbar, Drawer, Divider, Avatar, Button, List} from 'react-native-paper';
import { createStackNavigator } from 'react-navigation';
import { AppearanceProvider } from 'react-native-appearance';
import { NavigationContainer, DarkTheme } from '@react-navigation/native';

export default class DeviceListPage extends Component {

  test(item) {
    //other stuff first

    // go to other page with color and effects
    this.props.navigation.navigate('Main',item);
  }

  startScan = () => {
    console.log("hi");
  }

  renderItem(item) {
    return (
      <List.Item 
        title={item.name} 
        description={"RSSI: " + item.rssi} 
        onPress={() => this.test(item)} 
        left={props => <List.Icon {...props} icon="bluetooth" />}
      />
    );
  }

  render() {
    var list = [
      {
        name: "jacob LED strip",
        rssi: "test rssi",
        id: "test ID"
      },
      {
        name: "jacob LED strip2",
        rssi: "test rssi2",
        id: "test ID2"
      }
    ];

    return (
      <SafeAreaView style={styles.container}>
          <ScrollView style={styles.scroll}>
            {(list.length == 0) &&
              <View style={{flex:1, margin: 20}}>
                <Text style={{textAlign: 'center'}}>No peripherals</Text>
              </View>
            }
            <FlatList
              data={list}
              renderItem={({ item }) => this.renderItem(item) }
              keyExtractor={item => item.id}
            />
          </ScrollView>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scroll: {
    flex: 1,
    backgroundColor: '#f0f0f0',
  }
});