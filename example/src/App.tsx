/* eslint-disable react-native/no-inline-styles */
import * as React from 'react';

import { ScrollView, StyleSheet, Text, View } from 'react-native';
import HysteresisControl from 'react-native-hysteresis';
import type { Range } from '../../src/HysteresisControl.types';

const initialValues: Range = { min: 10, max: 40 };
const backgroundColor = '#ffffff';
const textColor = '#A56D76';
const lowColor = '#59C9FA';
const highColor = '#FA526E';
const axisColor = '#66747A';

export default function App() {
  const [range1, setRange1] = React.useState<Range>(initialValues);
  const [range2, setRange2] = React.useState<Range>(initialValues);
  const [range3, setRange3] = React.useState<Range>(initialValues);

  return (
    <ScrollView>
      <View style={styles.container}>
        <HysteresisControl
          range={{ min: 0, max: 50 }}
          step={5}
          initialValues={initialValues}
          onChange={(value: Range) => setRange1(value)}
          showAxisLabels
          style={{
            paddingBottom: 20,
            paddingLeft: 20,
            paddingTop: 20,
            paddingRight: 20,
            height: 250,
            width: 300,
            backgroundColor: backgroundColor,
          }}
          axisStyle={{
            width: 2,
            color: axisColor,
            fontColor: axisColor,
            fontSize: 15,
            fontFamily: 'tahoma',
            fontWeight: 'bold',
            fontStyle: 'italic',
          }}
          hysteresisLowStyle={{
            width: 4,
            color: lowColor,
          }}
          hysteresisHighStyle={{
            width: 4,
            color: highColor,
          }}
          controlStyle={{
            size: 15,
            width: 15,
          }}
        />
        <Text style={styles.valuesTextStyle}>
          Min: {range1.min} Max: {range1.max}
        </Text>
      </View>
      <View style={styles.container}>
        <HysteresisControl
          range={{ min: -50, max: 50 }}
          step={10}
          initialValues={initialValues}
          onChange={(value: Range) => setRange2(value)}
          showAxisLabels
          showControlLabel
          showYAxis
          unit="°C"
          style={{
            height: 250,
            width: 300,
            backgroundColor: backgroundColor,
          }}
          axisStyle={{
            width: 1,
            color: axisColor,
            fontColor: axisColor,
          }}
          hysteresisLowStyle={{
            width: 2,
            color: lowColor,
          }}
          hysteresisHighStyle={{
            width: 2,
            color: highColor,
          }}
          controlStyle={{
            size: 10,
            width: 2,
            backgroundColor: backgroundColor,
          }}
          controlLabelStyle={{
            borderWidth: 2,
            borderColor: axisColor,
            borderRadius: 10,
            height: 40,
            width: 65,
            fontSize: 24,
          }}
        />
        <Text style={styles.valuesTextStyle}>
          Min: {range2.min} Max: {range2.max}
        </Text>
      </View>
      <View style={styles.container}>
        <HysteresisControl
          range={{ min: 5, max: 45 }}
          step={1}
          initialValues={initialValues}
          onChange={(value: Range) => setRange3(value)}
          showControlLabel
          unit="mA"
          style={{
            paddingBottom: 0,
            paddingLeft: 0,
            paddingTop: 0,
            paddingRight: 0,
            height: 200,
            width: 300,
            backgroundColor: backgroundColor,
          }}
          axisStyle={{
            width: 1,
            color: axisColor,
            fontColor: axisColor,
          }}
          hysteresisLowStyle={{
            width: 2,
            color: lowColor,
          }}
          hysteresisHighStyle={{
            width: 2,
            color: highColor,
          }}
          controlStyle={{
            size: 15,
            width: 5,
            backgroundColor: backgroundColor,
            color: axisColor,
          }}
          controlLabelStyle={{
            borderWidth: 2,
            borderColor: axisColor,
            backgroundColor: backgroundColor,
            height: 35,
            width: 50,
            fontSize: 15,
          }}
        />
        <Text style={styles.valuesTextStyle}>
          Min: {range3.min} Max: {range3.max}
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: backgroundColor,
    borderBottomColor: axisColor,
    borderBottomWidth: 1,
    padding: 10,
  },
  valuesTextStyle: {
    fontSize: 20,
    marginTop: 10,
    color: textColor,
  },
  box: {
    width: 60,
    height: 60,
    marginVertical: 20,
  },
});
