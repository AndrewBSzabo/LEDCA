import React, { Component } from 'react';
import { Text, View, StyleSheet, Image } from 'react-native';

export default class MainPage extends React.Component {
  
  constructor(props) {
    super(props);
    
    this.state = {
      params: props.navigation.state.params
    }
    // console.log(props.navigation.getParam('name'));
    // console.log(props.navigation.state.params);
  }

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.paragraph}>
          Local files and assets can be imported by dragging and dropping them into the editor
        </Text>
        <Image style={styles.logo} source={require('../assets/snack-icon.png')} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  paragraph: {
    margin: 24,
    marginTop: 0,
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  logo: {
    height: 128,
    width: 128,
  }
});