/* eslint-disable react-native/no-inline-styles */
import * as React from 'react';

import { StyleSheet, View } from 'react-native';
import HysteresisControl from 'react-native-hysteresis';

export default function App() {
  return (
    <View style={styles.container}>
      <HysteresisControl
        range={{ min: 0, max: 50 }}
        step={5}
        initialValues={{ min: 10, max: 20 }}
        onChange={(e) => console.log(e)}
        style={{
          paddingBottom: 20,
          paddingLeft: 20,
          paddingTop: 20,
          paddingRight: 20,
          height: 300,
          width: 300,
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  box: {
    width: 60,
    height: 60,
    marginVertical: 20,
  },
});
