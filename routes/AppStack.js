import { createStackNavigator } from 'react-navigation-stack';
import { createAppContainer } from 'react-navigation';

import DeviceListPage from '../components/DeviceListPage';
import MainPage from '../components/MainPage';

const screens = {
  DeviceList: {
    screen: DeviceListPage,
    navigationOptions: {
      title: "Device List",
    }
  },
  Main: {
    screen: MainPage,
    navigationOptions: {
      title: "LED Strip Settings",
      
    }
  }
}

const AppStack = createStackNavigator(screens); 

export default createAppContainer(AppStack);

/*
 if i ever want to do a custom header this will go in "navigationOptions"
      headerMode: "screen",
      header: ({scene, previous, navigation }) => {
        return (
          <Appbar.Header>
            <Appbar.Content title="Device List" />
            <Appbar.Action icon="refresh" onPress={() => console.log(scene)} />
          </Appbar.Header>
        );
      }
      */