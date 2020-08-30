import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableHighlight,
  NativeEventEmitter,
  NativeModules,
  Platform,
  PermissionsAndroid,
  ScrollView,
  AppState,
  FlatList,
  Dimensions,
  Button,
  SafeAreaView
} from 'react-native';
import {} from 'react-native-paper';
import BleManager from 'react-native-ble-manager';

const BleManagerModule = NativeModules.BleManager;
const bleManagerEmitter = new NativeEventEmitter(BleManagerModule);

export default class MainPage extends Component {

  static navigationOptions = ({ navigation }) => {
      return {
          headerTitle: "Device List",
          headerLeft: (
              <View style={{marginLeft: 10}} >
                  <Button
                    onPress={() => {
                      navigation.getParam("disconnect");
                      navigation.goBack();
                    }}
                    title="Device List"
                  />
              </View>
          ),
      };
  };

  constructor(props) {
    super(props);
    
    this.state = {
      peripheral: props.navigation.state.params,
      appState: ''
    }

    // console.log(props.navigation.getParam('name'));
     console.log(props.navigation.state.params);

    this.handleUpdateValueForCharacteristic = this.handleUpdateValueForCharacteristic.bind(this);
    this.handleDisconnectedPeripheral = this.handleDisconnectedPeripheral.bind(this);
    this.handleAppStateChange = this.handleAppStateChange.bind(this);
  }

  componentDidMount() {
    this.props.navigation.setParams({ disconnect: this.disconnect});

    AppState.addEventListener('change', this.handleAppStateChange);

        BleManager.start({showAlert: false});

        this.handlerDisconnect = bleManagerEmitter.addListener('BleManagerDisconnectPeripheral', this.handleDisconnectedPeripheral );
        this.handlerUpdate = bleManagerEmitter.addListener('BleManagerDidUpdateValueForCharacteristic', this.handleUpdateValueForCharacteristic );



        if (Platform.OS === 'android' && Platform.Version >= 23) {
            PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION).then((result) => {
                if (result) {
                    console.log("Permission is OK");
                } else {
                    PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION).then((result) => {
                    if (result) {
                        console.log("User accept");
                    } else {
                        console.log("User refuse");
                    }
                    });
                }
            });
        }
    }

  handleAppStateChange(nextAppState) {
      if (this.state.appState.match(/inactive|background/) && nextAppState === 'active') {
          console.log('App has come to the foreground!')
          BleManager.getConnectedPeripherals([]).then((peripheralsArray) => {
          console.log('Connected peripherals: ' + peripheralsArray.length);
          });
      }
      this.setState({appState: nextAppState});
  }

  componentWillUnmount() {
    this.handlerDisconnect.remove();
    this.handlerUpdate.remove();
  }

  handleDisconnectedPeripheral(data) {
    console.log('Disconnected from ' + data.peripheral);
  }

  handleUpdateValueForCharacteristic(data) {
      console.log('Received data from ' + data.peripheral + ' characteristic ' + data.characteristic, data.value);
  }

  disconnect = () => {
    console.log("hello");
    BleManager.disconnect(this.state.peripheral.id);
  }

  render() {
    return (
      <View >
        <Text >
          Local files and assets can be imported by dragging and dropping them into the editor
        </Text>
      </View>
    );
  }
}