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
import BleManager from 'react-native-ble-manager';

import { Appbar, Drawer, Divider, Avatar, List} from 'react-native-paper';

const BleManagerModule = NativeModules.BleManager;
const bleManagerEmitter = new NativeEventEmitter(BleManagerModule);

export default class DeviceListPage extends Component {

    static navigationOptions = ({ navigation }) => {
        return {
            headerTitle: "Device List",
            headerRight: (
                <View style={{marginRight: 10}} >
                    <Button
                      onPress={navigation.getParam('scan')}
                      title="Scan"
                    />
                </View>
            ),
        };
    };

    constructor(){
        super()

        this.state = {
            scanning:false,
            peripherals: new Map(),
            appState: ''
        }

        this.handleDiscoverPeripheral = this.handleDiscoverPeripheral.bind(this);
        this.handleStopScan = this.handleStopScan.bind(this);
        this.handleUpdateValueForCharacteristic = this.handleUpdateValueForCharacteristic.bind(this);
        this.handleDisconnectedPeripheral = this.handleDisconnectedPeripheral.bind(this);
        this.handleAppStateChange = this.handleAppStateChange.bind(this);
    }

    componentDidMount() {
        this.props.navigation.setParams({ scan: this.startScan});

        AppState.addEventListener('change', this.handleAppStateChange);

        BleManager.start({showAlert: false});

        this.handlerDiscover = bleManagerEmitter.addListener('BleManagerDiscoverPeripheral', this.handleDiscoverPeripheral );
        this.handlerStop = bleManagerEmitter.addListener('BleManagerStopScan', this.handleStopScan );
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
        this.handlerDiscover.remove();
        this.handlerStop.remove();
        this.handlerDisconnect.remove();
        this.handlerUpdate.remove();
    }

    handleDisconnectedPeripheral(data) {
        let peripherals = this.state.peripherals;
        let peripheral = peripherals.get(data.peripheral);
        if (peripheral) {
            peripheral.connected = false;
            peripherals.set(peripheral.id, peripheral);
            this.setState({peripherals});
        }
        console.log('Disconnected from ' + data.peripheral);
    }

    handleUpdateValueForCharacteristic(data) {
        console.log('Received data from ' + data.peripheral + ' characteristic ' + data.characteristic, data.value);
    }

    handleStopScan() {
        console.log('Scan is stopped');
        this.setState({ scanning: false });
    }

    startScan = () => {
        if (!this.state.scanning) {
            //this.setState({peripherals: new Map()});
            BleManager.scan([], 3, true).then((results) => {
            console.log('Scanning...');
            this.setState({scanning:true});
            });
        }
    }

    retrieveConnected(){
        BleManager.getConnectedPeripherals([]).then((results) => {
            if (results.length == 0) {
            console.log('No connected peripherals')
            }
            console.log(results);
            var peripherals = this.state.peripherals;
            for (var i = 0; i < results.length; i++) {
            var peripheral = results[i];
            peripheral.connected = true;
            peripherals.set(peripheral.id, peripheral);
            this.setState({ peripherals });
            }
        });
    }

    handleDiscoverPeripheral(peripheral){
        var peripherals = this.state.peripherals;
        console.log('Got ble peripheral', peripheral);
        if (peripheral.name) {
            peripherals.set(peripheral.id, peripheral);
            this.setState({ peripherals });
        }
    }

    test(peripheral) {
        if (peripheral){
            if (peripheral.connected){
            BleManager.disconnect(peripheral.id);
            }else{
            BleManager.connect(peripheral.id).then(() => {
                let peripherals = this.state.peripherals;
                let p = peripherals.get(peripheral.id);
                if (p) {
                p.connected = true;
                peripherals.set(peripheral.id, p);
                this.setState({peripherals});
                }
                console.log('Connected to ' + peripheral.id);
                
                this.props.navigation.navigate('Main',peripheral);

/*
                setTimeout(() => {

                 Test read current RSSI value
                BleManager.retrieveServices(peripheral.id).then((peripheralData) => {
                    console.log('Retrieved peripheral services', peripheralData);
                    BleManager.readRSSI(peripheral.id).then((rssi) => {
                    console.log('Retrieved actual RSSI value', rssi);
                    });
                });

                // Test using bleno's pizza example
                // https://github.com/sandeepmistry/bleno/tree/master/examples/pizza
                BleManager.retrieveServices(peripheral.id).then((peripheralInfo) => {
                    console.log(peripheralInfo);
                    var service = '13333333-3333-3333-3333-333333333337';
                    var bakeCharacteristic = '13333333-3333-3333-3333-333333330003';
                    var crustCharacteristic = '13333333-3333-3333-3333-333333330001';

                    setTimeout(() => {
                    BleManager.startNotification(peripheral.id, service, bakeCharacteristic).then(() => {
                        console.log('Started notification on ' + peripheral.id);
                        setTimeout(() => {
                        BleManager.write(peripheral.id, service, crustCharacteristic, [0]).then(() => {
                            console.log('Writed NORMAL crust');
                            BleManager.write(peripheral.id, service, bakeCharacteristic, [1,95]).then(() => {
                            console.log('Writed 351 temperature, the pizza should be BAKED');
                            
                            var PizzaBakeResult = {
                                HALF_BAKED: 0,
                                BAKED:      1,
                                CRISPY:     2,
                                BURNT:      3,
                                ON_FIRE:    4
                            };
                            });
                        });

                        }, 500);
                    }).catch((error) => {
                        console.log('Notification error', error);
                    });
                    }, 200);
                });

                }, 900);
            */
            }).catch((error) => {
                console.log('Connection error', error);
            });
            }
        }
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

    const list = Array.from(this.state.peripherals.values());

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