export type Range = {
  min: number;
  max: number;
};

export type Style = {
  backgroundColor?: string;
  height?: number;
  width?: number;
  paddingLeft?: number;
  paddingRight?: number;
  paddingBottom?: number;
  paddingTop?: number;
};

export type LineStyle = {
  width?: number;
  color?: string;
};

export type ControlStyle = LineStyle & {
  size?: number;
  backgroundColor?: string;
};

export type ControlLabelStyle = FontStyle & {
  backgroundColor?: string;
  height?: number;
  width?: number;
  borderWidth?: number;
  borderColor?: string;
  borderRadius?: number;
};

export type FontStyle = {
  fontFamily?: string;
  fontSize?: number;
  fontStyle?: 'normal' | 'italic';
  fontWeight?: 'normal' | 'bold' | '100' | '200' | '300' | '400';
  fontColor?: string;
};

export type AxisStyle = LineStyle & FontStyle;

export type HysteresisPosition = 'top' | 'bottom';

export type HysteresisProps = {
  range: Range;
  initialValues: Range;
  step: number;
  unit?: string;
  onChange: (result: Range) => void;
  showAxisLabels?: boolean;
  // TODO rethink/redesign
  showFill?: boolean;
  showYAxis?: boolean;
  showControlLabel?: boolean;
  showInverted?: boolean;
  style?: Style;
  axisStyle?: AxisStyle;
  hysteresisLowStyle?: LineStyle;
  hysteresisHighStyle?: LineStyle;
  controlStyle?: ControlStyle;
  controlLabelStyle?: ControlLabelStyle;
};
