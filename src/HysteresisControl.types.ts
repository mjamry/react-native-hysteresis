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

export type XAxisSettings = {
  showLabels?: boolean;
  title?: string;
};

export type YAxisSettings = {
  showAxis?: boolean;
  labels?: { top: string; bottom: string };
};

export type HysteresisPosition = 'top' | 'bottom';

export type HysteresisProps = {
  range: Range;
  initialValues: Range;
  step: number;
  onChange: (result: Range) => void;
  unit?: string;
  showControlLabel?: boolean;
  showInverted?: boolean;
  xAxisSettings?: XAxisSettings;
  yAxisSettings?: YAxisSettings;
  style?: Style;
  axisStyle?: AxisStyle;
  hysteresisLowStyle?: LineStyle;
  hysteresisHighStyle?: LineStyle;
  controlStyle?: ControlStyle;
  controlLabelStyle?: ControlLabelStyle;
  // TODO rethink/redesign
  showFill?: boolean;
};
