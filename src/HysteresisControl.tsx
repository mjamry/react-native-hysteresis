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
import type {
  HysteresisProps,
  HysteresisPosition,
} from './HysteresisControl.types';

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
const HysteresisAxisDistance = 20;
const ControlLabelPadding = 5;
const LabelAxisDistance = 5;
const AxisLineLength = 10;
const AxisLengthAddon = 5;

const HysteresisControl = (props: HysteresisProps) => {
  const {
    range,
    initialValues,
    step,
    unit,
    xAxisSettings,
    yAxisSettings,
    showControlLabel,
    showFill,
    showInverted,
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

  // general values config
  const window = useWindowDimensions();
  const width = style?.width ?? window.width;
  const height = style?.height ?? DefaultHeight;
  const paddingTop = (style?.paddingTop ?? DefaultPadding) + RequiredPadding;
  const paddingBottom =
    (style?.paddingBottom ?? DefaultPadding) + RequiredPadding;
  const paddingLeft = (style?.paddingLeft ?? DefaultPadding) + RequiredPadding;
  const paddingRight =
    (style?.paddingRight ?? DefaultPadding) + RequiredPadding;

  // styles config
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

  // axis configs
  const axisFont = matchFont({
    fontFamily: axisStyle?.fontFamily ?? DefaultFontFamily,
    fontSize: axisStyle?.fontSize ?? DefaultFontSize,
    fontStyle: axisStyle?.fontStyle ?? DefaultFontStyle,
    fontWeight: axisStyle?.fontWeight ?? DefaultFontWeight,
  });

  const axisLabelSize = axisStyle?.fontSize ?? DefaultFontSize;
  const x_axis_pos =
    height -
    (xAxisSettings?.showLabels ? axisLabelSize : 0) -
    (xAxisSettings?.title ? axisLabelSize : 0) -
    paddingBottom;

  const y_axis_labels_width = yAxisSettings?.labels
    ? axisFont.measureText(
        yAxisSettings?.labels.top.length > yAxisSettings?.labels.bottom.length
          ? yAxisSettings?.labels.top
          : yAxisSettings?.labels.bottom
      ).width
    : 0;
  const y_axis_pos = paddingLeft + y_axis_labels_width;

  const x_axis_len = width - y_axis_pos - paddingRight;
  const line_space = x_axis_len / ((range.max - range.min) / step);

  // hysteresis config
  const hysteresis_y_bottom = x_axis_pos - HysteresisAxisDistance;
  const hysteresis_y_top = paddingTop + AxisLengthAddon;

  // control config
  const control_y_pos = (x_axis_pos + hysteresis_y_top) / 2;
  const touch_radius =
    controlSize < MinTouchRadius ? MinTouchRadius : controlSize;

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
    path.moveTo(y_axis_pos - AxisLengthAddon, x_axis_pos);
    path.lineTo(width - paddingRight + AxisLengthAddon, x_axis_pos);
    // y axis
    if (yAxisSettings?.showAxis || yAxisSettings?.labels) {
      path.moveTo(y_axis_pos, paddingTop);
      path.lineTo(y_axis_pos, x_axis_pos);
    }

    const half_axis_line = AxisLineLength / 2;
    const y_start = x_axis_pos - half_axis_line;
    const y_end = x_axis_pos + half_axis_line;

    for (
      let i = y_axis_pos, index = range.min;
      index <= range.max;
      i += line_space, index += step
    ) {
      path.moveTo(i, y_start);
      path.lineTo(i, y_end);
    }

    if (yAxisSettings?.showAxis || yAxisSettings?.labels) {
      path.moveTo(y_axis_pos - half_axis_line, hysteresis_y_bottom);
      path.lineTo(y_axis_pos + half_axis_line, hysteresis_y_bottom);

      path.moveTo(y_axis_pos - half_axis_line, hysteresis_y_top);
      path.lineTo(y_axis_pos + half_axis_line, hysteresis_y_top);
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
        {renderAxisLabels()}
      </>
    );
  };

  const renderAxisLabels = () => {
    const output = [];

    // render X axis labels
    if (xAxisSettings?.showLabels) {
      for (
        let i = y_axis_pos, index = range.min;
        index <= range.max;
        i += line_space, index += step
      ) {
        const text = index.toString();
        const textSize = axisFont.measureText(text);
        output.push(
          <Text
            x={i - textSize.width / 2}
            y={x_axis_pos + axisLabelSize + LabelAxisDistance}
            text={index.toString()}
            key={index}
            font={axisFont}
            color={axisStyle?.fontColor ?? DefaultFontColor}
          />
        );
      }
    }

    // render X axis title
    if (xAxisSettings?.title) {
      const text = xAxisSettings?.title;
      const textSize = axisFont.measureText(text);
      const y_pos =
        x_axis_pos +
        (xAxisSettings?.showLabels
          ? (axisLabelSize + LabelAxisDistance) * 2
          : axisLabelSize + LabelAxisDistance);
      output.push(
        <Text
          x={y_axis_pos + x_axis_len / 2 - textSize.width / 2}
          y={y_pos}
          text={text}
          font={axisFont}
          color={axisStyle?.fontColor ?? DefaultFontColor}
        />
      );
    }

    // render Y axis labels
    if (yAxisSettings?.labels) {
      const text_bottom = yAxisSettings.labels.bottom;
      const textSize_bottom = axisFont.measureText(text_bottom);
      output.push(
        <Text
          x={
            y_axis_pos -
            textSize_bottom.width -
            AxisLineLength / 2 -
            LabelAxisDistance
          }
          y={hysteresis_y_bottom + textSize_bottom.height / 2}
          text={text_bottom}
          font={axisFont}
          color={axisStyle?.fontColor ?? DefaultFontColor}
        />
      );
      const text_top = yAxisSettings?.labels.top;
      const textSize_top = axisFont.measureText(text_top);
      output.push(
        <Text
          x={
            y_axis_pos -
            textSize_top.width -
            AxisLineLength / 2 -
            LabelAxisDistance
          }
          y={hysteresis_y_top + textSize_top.height / 2}
          text={text_top}
          font={axisFont}
          color={axisStyle?.fontColor ?? DefaultFontColor}
        />
      );
    }

    return output;
  };

  const renderHysteresisFill = () => {
    const x_start = calc_hysteresis_x_pos(min);
    const x_end = calc_hysteresis_x_pos(max) - x_start;
    const y_start = hysteresis_y_top;
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

  const renderHysteresisLine = (
    position: HysteresisPosition,
    value: number,
    x_start: number,
    lineColor: string,
    lineWidth: number
  ) => {
    const x_end = calc_hysteresis_x_pos(value);
    const path = Skia.Path.Make();
    path.moveTo(
      x_start,
      position === 'bottom' ? hysteresis_y_top : hysteresis_y_bottom
    );
    path.lineTo(
      x_end,
      position === 'bottom' ? hysteresis_y_top : hysteresis_y_bottom
    );
    path.lineTo(
      x_end,
      position === 'bottom' ? hysteresis_y_bottom : hysteresis_y_top
    );
    path.moveTo(0, 0);
    path.close();

    return (
      <>
        <Path
          path={path}
          color={lineColor}
          strokeWidth={lineWidth}
          style="stroke"
        />
        {renderControl(
          x_end,
          controlStyle?.color ? controlStyle.color : lineColor
        )}
      </>
    );
  };

  const renderHysteresisLow = () => {
    return renderHysteresisLine(
      showInverted ? 'top' : 'bottom',
      min,
      width - paddingRight,
      hysteresisLowColor,
      hysteresisLowWidth
    );
  };

  const renderHysteresisHigh = () => {
    return renderHysteresisLine(
      showInverted ? 'bottom' : 'top',
      max,
      y_axis_pos,
      hysteresisHighColor,
      hysteresisHighWidth
    );
  };

  const renderLabel = (value: number, color: string) => {
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

    const labelHeight =
      controlLabelStyle?.height ??
      textSize.height + (ControlLabelPadding + borderWidth) * 2;
    const labelWidth =
      controlLabelStyle?.width ??
      textSize.width + (ControlLabelPadding + borderWidth) * 2;

    const label_y_pos =
      controlLabelStyle?.height ?? control_y_pos / 2 - labelHeight / 2;

    let x_pos = calc_hysteresis_x_pos(value) - labelWidth / 2;
    if (x_pos + labelWidth > width) {
      x_pos = width - labelWidth;
    }
    if (x_pos < 0) {
      x_pos = 0;
    }

    return (
      <>
        <RoundedRect
          x={x_pos}
          y={label_y_pos}
          width={labelWidth}
          height={labelHeight}
          r={radius}
          color={controlLabelStyle?.borderColor ?? color}
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
            {canShowMinLabel && showControlLabel ? (
              renderLabel(min, hysteresisLowColor)
            ) : (
              <></>
            )}
            {canShowMaxLabel && showControlLabel ? (
              renderLabel(max, hysteresisHighColor)
            ) : (
              <></>
            )}
          </Canvas>
        </GestureDetector>
      </View>
    </GestureHandlerRootView>
  );
};

export default HysteresisControl;
