import { Scale } from 'chart.js';
import { decimateTicks, formatNumber } from '../../utils/chart.util';

interface InputChartOptions {
  isDarkPicture: boolean;
  maxWidth: number;
  maxHeight: number;
  maxValue?: number;
}

interface InputScaleOptions extends InputChartOptions {
  fontSize: number;
  strokeWidth: number;
}

export function getStrainChartOptions(chartOptions: InputChartOptions): any {
  return {
    ...getBaseChartOptions(),
    scales: getStrainChartScales(chartOptions),
    plugins: getStrainChartPlugins(chartOptions),
  };
}

function getStrainChartScales(chartOptions: InputChartOptions) {
  return {
    x: getStrainChartScalesX({
      ...chartOptions,
      fontSize: 12,
      strokeWidth: 0.5,
    }),
    y: getStrainChartScalesY({
      ...chartOptions,
      fontSize: 12,
      strokeWidth: 0.5,
    }),
  };
}

function getStrainChartScalesX(scaleOptions: InputScaleOptions) {
  const { fontSize, maxWidth, strokeWidth, isDarkPicture } = scaleOptions;

  return {
    grid: {
      drawOnChartArea: true,
      color: isDarkPicture
        ? 'rgba(255, 255, 255, 0.7)'
        : 'rgba(0, 0, 0, 0.7)',
      lineWidth: 0.5,

      drawBorder: true,
      borderColor: isDarkPicture ? 'white' : 'black',
      borderWidth: 1.25,

      drawTicks: true,
      tickLength: 4,
    },
    ticks: {
      font: {
        size: maxWidth / (maxWidth / fontSize),
        weight: 'bold',
      },
      color: isDarkPicture ? 'white' : 'black',
      textStrokeColor: 'black',
      textStrokeWidth: maxWidth / (maxWidth / strokeWidth),
      maxRotation: 0,
    },
    afterBuildTicks: (axis: Scale) => {
      axis.ticks = decimateTicks(axis.ticks);
    },
  };
}

function getStrainChartScalesY(scaleOptions: InputScaleOptions) {
  const {
    fontSize,
    maxHeight,
    isDarkPicture,
    maxValue,
    strokeWidth,
  } = scaleOptions;

  return {
    stacked: false,
    beginAtZero: true,
    title: false,
    max: maxValue,
    grid: {
      drawOnChartArea: true,
      color: 'rgba(0, 0, 0, 0.2)',
      lineWidth: 0.5,

      drawBorder: true,
      borderColor: isDarkPicture ? 'white' : 'black',
      borderWidth: 1.25,

      drawTicks: true,
      tickColor: 'transparent',
      tickLength: 1,
    },
    ticks: {
      font: {
        size: maxHeight / (maxHeight / fontSize),
        weight: 'bold',
      },
      color: isDarkPicture ? 'white' : 'black',
      textStrokeColor: 'black',
      textStrokeWidth: maxHeight / (maxHeight / strokeWidth),
      maxRotation: 0,
      stepSize: maxValue as number / 4,
      callback: formatNumber,
    },
  };
}

function getStrainChartPlugins(chartOptions: InputChartOptions) {
  const legend = {
    position: 'top',
    align: 'end',
    labels: {
      color: chartOptions.isDarkPicture ? 'white' : 'black',
      boxWidth: 7,
      boxHeight: 2,
      padding: 7,
      font: {
        size: chartOptions.maxWidth / (chartOptions.maxWidth / 13.5),
        weight: 'bold',
      },
    },
  };

  return { legend };
}

function getBaseChartOptions() {
  return {
    normalized: true,
    spanGaps: true,
    animation: false,
    responsive: false,
  };
}
