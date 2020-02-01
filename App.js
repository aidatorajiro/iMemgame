/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, { Component } from 'react'
import { GLView } from 'expo-gl';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
  TouchableWithoutFeedback,
  TouchableOpacity,
  NativeModules,
} from 'react-native';

import {
  Header,
  LearnMoreLinks,
  Colors,
  DebugInstructions,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';

const Game = require('./Game.js')
const Globals = require('./Globals.js')

export default class App extends Component {
  constructor(props) {
    super(props)
    this.state = { glstyle: {} }
  }

  onLayout = (ev) => {
    console.log('layout!')
    for (let func of Globals.onLayout) {
      func(ev)
    }
    this.setState({
      glstyle: {
        backgroundColor: "#000000",
        width: ev.nativeEvent.layout.width + Globals.edge_size,
        height: ev.nativeEvent.layout.height + Globals.edge_size,
        marginTop: -Globals.edge_size / 2,
        marginLeft: -Globals.edge_size / 2
      }
    })
  }

  onPress = (ev) => {
    console.log('pressed!')
    for (let func of Globals.onClick) {
      func(ev)
    }
  }

  onLoad = (gl) => {
    console.log('loaded!')
    Globals.gl = gl
    Globals.game = new Game()
    Globals.game.init()
  }

 render() {
   return (
      <View>
        <TouchableWithoutFeedback onPress={this.onPress} onLayout={this.onLayout}>
          <View style={styles.touchscreen}>
            <GLView style={this.state.glstyle} onContextCreate={this.onLoad}/>
          </View>
        </TouchableWithoutFeedback>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  body: {
    margin: 0,
    overflow: 'hidden'
  },
  touchscreen: {
    width: '100%',
    height: '100%'
  }
});
