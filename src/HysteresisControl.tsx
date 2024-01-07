import {
  Canvas,
  Circle,
  Fill,
  LinearGradient,
  Path,
  Rect,
  RoundedRect,
  Skia,
  Text,
  matchFont,
  vec,
} from '@shopify/react-native-skia';
import React, { useEffect, useState } from 'react';
import { StyleSheet, View, useWindowDimensions } from 'react-native';
import {
  Gesture,
  GestureDetector,
  GestureHandlerRootView,
} from 'react-native-gesture-handler';
import type { HysteresisProps } from './HysteresisControl.types';

const styles = StyleSheet.create({
  container: {
    alignSelf: 'stretch',
  },
});

const DefaultHeight = 200;
const DefaultLineColor = 'gray';
const DefaultLineWidth = 1;
const DefaultBackgroundColor = 'white';
const DefaultPadding = 10;
const RequiredPadding = 10;
const DefaultControlSize = 10;
const MinTouchRadius = 20;
const DefaultFontWeight = 'normal';
const DefaultFontSize = 15;
const DefaultFontStyle = 'normal';
const DefaultFontFamily = 'arial';
const DefaultFontColor = 'black';
const DefaultControlLabelWidth = 35;
const DefaultControlLabelHeight = 25;
//TODO: allow to use inverted hysteresis lines
const HysteresisControl = (props: HysteresisProps) => {
  const {
    range,
    initialValues,
    step,
    unit,
    showAxisLabels,
    showControlLabel,
    showYAxis,
    showFill,
    style,
    axisStyle,
    hysteresisLowStyle,
    hysteresisHighStyle,
    controlStyle,
    controlLabelStyle,
    onChange,
  } = props;
  const [min, setMin] = useState(0);
  const [max, setMax] = useState(0);
  const [canChangeMin, setCanChangeMin] = useState(false);
  const [canChangeMax, setCanChangeMax] = useState(false);
  const [canShowMinLabel, setCanShowMinLabel] = useState(false);
  const [canShowMaxLabel, setCanShowMaxLabel] = useState(false);
  const window = useWindowDimensions();

  const width = style?.width ?? window.width;
  const height = style?.height ?? DefaultHeight;
  const paddingTop = (style?.paddingTop ?? DefaultPadding) + RequiredPadding;
  const paddingBottom =
    (style?.paddingBottom ?? DefaultPadding) + RequiredPadding;
  const paddingLeft = (style?.paddingLeft ?? DefaultPadding) + RequiredPadding;
  const paddingRight =
    (style?.paddingRight ?? DefaultPadding) + RequiredPadding;
  const axisColor = axisStyle?.color ?? DefaultLineColor;
  const axisWidth = axisStyle?.width ?? DefaultLineWidth;
  const hysteresisLowColor = hysteresisLowStyle?.color ?? DefaultLineColor;
  const hysteresisHighColor = hysteresisHighStyle?.color ?? DefaultLineColor;
  const hysteresisLowWidth = hysteresisLowStyle?.width ?? DefaultLineWidth;
  const hysteresisHighWidth = hysteresisHighStyle?.width ?? DefaultLineWidth;
  const controlSize = controlStyle?.size ?? DefaultControlSize;
  const controlWidth = controlStyle?.width ?? DefaultLineWidth;
  const controlBackground =
    controlStyle?.backgroundColor ?? DefaultBackgroundColor;

  const axisLabelSize = axisStyle?.fontSize ?? DefaultFontSize;
  const x_axis_pos =
    height - (showAxisLabels ? axisLabelSize : 0) - paddingBottom;
  const y_axis_pos = paddingLeft;
  const x_axis_len = width - paddingLeft - paddingRight;
  const axis_line_length = 10;
  const hysteresis_axis_distance = 20;
  const line_space = x_axis_len / ((range.max - range.min) / step);

  const hysteresis_height = paddingTop;
  const control_y_pos = (x_axis_pos + hysteresis_height) / 2;

  const touch_radius =
    controlSize < MinTouchRadius ? MinTouchRadius : controlSize;
  const label_y_pos = 40;

  useEffect(() => {
    setMin(initialValues.min);
    setMax(initialValues.max);
  }, [initialValues.max, initialValues.min]);

  const calc_hysteresis_x_pos = (value: number) => {
    return ((value - range.min) / step) * line_space + y_axis_pos;
  };

  const renderAxis = () => {
    const path = Skia.Path.Make();
    // x axis
    path.moveTo(paddingLeft, x_axis_pos);
    path.lineTo(width - paddingRight, x_axis_pos);
    // y axis
    if (showYAxis) {
      path.moveTo(y_axis_pos, paddingTop);
      path.lineTo(y_axis_pos, x_axis_pos);
    }

    const y_start = x_axis_pos - axis_line_length / 2;
    const y_end = x_axis_pos + axis_line_length / 2;

    for (
      let i = y_axis_pos, index = range.min;
      index <= range.max;
      i += line_space, index += step
    ) {
      path.moveTo(i, y_start);
      path.lineTo(i, y_end);
    }

    path.close();

    return (
      <>
        <Path
          path={path}
          color={axisColor}
          strokeWidth={axisWidth}
          style="stroke"
        />
        {showAxisLabels && renderAxisLabels()}
      </>
    );
  };

  const renderAxisLabels = () => {
    const output = [];
    const font = matchFont({
      fontFamily: axisStyle?.fontFamily ?? DefaultFontFamily,
      fontSize: axisStyle?.fontSize ?? DefaultFontSize,
      fontStyle: axisStyle?.fontStyle ?? DefaultFontStyle,
      fontWeight: axisStyle?.fontWeight ?? DefaultFontWeight,
    });
    //TODO: render unit
    //TODO: render On/Off on Y axis
    for (
      let i = y_axis_pos, index = range.min;
      index <= range.max;
      i += line_space, index += step
    ) {
      output.push(
        <Text
          x={i - axisLabelSize / 3}
          y={x_axis_pos + axisLabelSize + 5}
          text={index.toString()}
          key={index}
          font={font}
          color={axisStyle?.fontColor ?? DefaultFontColor}
        />
      );
    }

    return output;
  };

  const renderHysteresisFill = () => {
    const x_start = calc_hysteresis_x_pos(min);
    const x_end = calc_hysteresis_x_pos(max) - x_start;
    const y_start = hysteresis_height;
    const y_end = x_axis_pos - y_start;

    return (
      <>
        <Rect x={x_start} y={y_start} width={x_end} height={y_end}>
          <LinearGradient
            start={vec(x_start, y_start)}
            end={vec(x_end, y_end)}
            colors={[hysteresisHighColor, hysteresisLowColor]}
          />
        </Rect>
      </>
    );
  };

  const renderControl = (x_pos: number, color: string) => {
    return (
      <>
        <Circle
          cx={x_pos}
          cy={control_y_pos - controlSize / 2}
          r={controlSize}
          color={color}
        />
        <Circle
          cx={x_pos}
          cy={control_y_pos - controlSize / 2}
          r={controlSize - controlWidth}
          color={controlBackground}
        />
      </>
    );
  };

  const renderHysteresisLow = () => {
    const maxPos = calc_hysteresis_x_pos(max);
    const path = Skia.Path.Make();
    path.moveTo(paddingLeft, x_axis_pos - hysteresis_axis_distance);
    path.lineTo(maxPos, x_axis_pos - hysteresis_axis_distance);
    path.lineTo(maxPos, hysteresis_height);
    path.moveTo(0, 0);
    path.close();

    return (
      <>
        <Path
          path={path}
          color={hysteresisLowColor}
          strokeWidth={hysteresisLowWidth}
          style="stroke"
        />
        {renderControl(
          maxPos,
          controlStyle?.color ? controlStyle.color : hysteresisLowColor
        )}
      </>
    );
  };

  const renderHysteresisHigh = () => {
    const minPos = calc_hysteresis_x_pos(min);
    const path = Skia.Path.Make();

    path.moveTo(minPos, x_axis_pos - hysteresis_axis_distance);
    path.lineTo(minPos, hysteresis_height);
    path.lineTo(width - paddingRight, hysteresis_height);
    path.moveTo(0, 0);
    path.close();

    return (
      <>
        <Path
          path={path}
          color={hysteresisHighColor}
          strokeWidth={hysteresisHighWidth}
          style="stroke"
        />
        {renderControl(
          minPos,
          controlStyle?.color ? controlStyle.color : hysteresisHighColor
        )}
      </>
    );
  };

  const renderLabel = (value: number) => {
    const labelHeight = controlLabelStyle?.height ?? DefaultControlLabelHeight;
    const labelWidth = controlLabelStyle?.width ?? DefaultControlLabelWidth;
    const x_pos = calc_hysteresis_x_pos(value) - labelWidth / 2;
    const radius = controlLabelStyle?.borderRadius ?? 0;
    const borderWidth = controlLabelStyle?.borderWidth ?? DefaultLineWidth;
    const font = matchFont({
      fontFamily: controlLabelStyle?.fontFamily ?? DefaultFontFamily,
      fontSize: controlLabelStyle?.fontSize ?? DefaultFontSize,
      fontStyle: controlLabelStyle?.fontStyle ?? DefaultFontStyle,
      fontWeight: controlLabelStyle?.fontWeight ?? DefaultFontWeight,
    });
    const text = `${value}${unit ? unit : ''}`;
    const textSize = font.measureText(text);

    return (
      <>
        <RoundedRect
          x={x_pos}
          y={label_y_pos}
          width={labelWidth}
          height={labelHeight}
          r={radius}
          color={controlLabelStyle?.borderColor ?? DefaultBackgroundColor}
        />
        <RoundedRect
          x={x_pos + borderWidth}
          y={label_y_pos + borderWidth}
          width={labelWidth - borderWidth * 2}
          height={labelHeight - borderWidth * 2}
          r={radius}
          color={controlLabelStyle?.backgroundColor ?? DefaultBackgroundColor}
        />
        <Text
          x={x_pos + labelWidth / 2 - textSize.width / 2}
          y={label_y_pos + labelHeight / 2 + textSize.height / 2}
          text={text}
          font={font}
          color={controlLabelStyle?.fontColor ?? DefaultFontColor}
        />
      </>
    );
  };

  const panGesture = Gesture.Pan()
    .minDistance(1)
    .onStart((e) => {
      const low_x = calc_hysteresis_x_pos(min);
      const high_x = calc_hysteresis_x_pos(max);

      if (
        e.x > low_x - touch_radius &&
        e.x < low_x + touch_radius &&
        e.y > control_y_pos - touch_radius &&
        e.y < control_y_pos + touch_radius
      ) {
        setCanChangeMin(true);
        setCanShowMinLabel(true);
      }

      if (
        e.x > high_x - touch_radius &&
        e.x < high_x + touch_radius &&
        e.y > control_y_pos - touch_radius &&
        e.y < control_y_pos + touch_radius
      ) {
        setCanChangeMax(true);
        setCanShowMaxLabel(true);
      }
    })
    .onEnd(() => {
      setCanChangeMin(false);
      setCanChangeMax(false);
      setCanShowMinLabel(false);
      setCanShowMaxLabel(false);
      onChange({ min, max });
    })
    .onUpdate((e) => {
      if (canChangeMin || canChangeMax) {
        const newValue = Math.floor(e.x / line_space) * props.step + range.min;
        if (canChangeMin) {
          if (newValue >= range.min && newValue < max) {
            setMin(newValue);
          }
        }

        if (canChangeMax) {
          if (newValue > min && newValue <= range.max) {
            setMax(newValue);
          }
        }
      }
    });

  return (
    <GestureHandlerRootView>
      <View style={styles.container}>
        <GestureDetector gesture={panGesture}>
          <Canvas style={{ width: width, height: height }}>
            <Fill color={style?.backgroundColor ?? DefaultBackgroundColor} />
            {renderAxis()}
            {showFill && renderHysteresisFill()}
            {renderHysteresisLow()}
            {renderHysteresisHigh()}
            {canShowMinLabel && showControlLabel ? renderLabel(min) : <></>}
            {canShowMaxLabel && showControlLabel ? renderLabel(max) : <></>}
          </Canvas>
        </GestureDetector>
      </View>
    </GestureHandlerRootView>
  );
};

export default HysteresisControl;
