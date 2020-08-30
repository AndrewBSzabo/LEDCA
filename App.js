import React, { Component } from 'react';
import Navigator from './routes/AppStack';
import { Provider as PaperProvider } from 'react-native-paper';

export default class App extends Component {
  render() {
    return (
      <PaperProvider dark={true}>
        <Navigator />
      </PaperProvider>
    );
  }
}