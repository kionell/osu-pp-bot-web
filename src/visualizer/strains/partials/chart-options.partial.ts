import { Scale } from 'chart.js';
import { decimateTicks, formatNumber } from '../../utils/chart.util';

interface InputChartOptions {
  isDarkPicture: boolean;
  maxWidth: number;
  maxHeight: number;
  maxValue?: number;
}

interface InputScaleOptions {
  isDarkPicture: boolean;
  fontWidth: number;
  strokeWidth: number;
  maxValue?: number;
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
      fontWidth: chartOptions.maxWidth / 46,
      strokeWidth: chartOptions.maxWidth / 1104,
      isDarkPicture: chartOptions.isDarkPicture,
    }),
    y: getStrainChartScalesY({
      fontWidth: chartOptions.maxHeight / 12.5,
      strokeWidth: chartOptions.maxHeight / 250,
      isDarkPicture: chartOptions.isDarkPicture,
      maxValue: chartOptions.maxValue,
    }),
  };
}

function getStrainChartScalesX(scaleOptions: InputScaleOptions) {
  return {
    grid: {
      drawOnChartArea: true,
      color: scaleOptions.isDarkPicture ? 'white' : 'black',
      lineWidth: 1,

      drawBorder: true,
      borderColor: scaleOptions.isDarkPicture ? 'white' : 'black',
      borderWidth: 1,

      drawTicks: true,
      tickLength: 4,
    },
    ticks: {
      font: {
        size: scaleOptions.fontWidth,
        weight: 'bold',
      },
      color: scaleOptions.isDarkPicture ? 'white' : 'black',
      textStrokeColor: 'black',
      textStrokeWidth: scaleOptions.strokeWidth,
      maxRotation: 0,
    },
    afterBuildTicks: (axis: Scale) => {
      axis.ticks = decimateTicks(axis.ticks);
    },
  };
}

function getStrainChartScalesY(scaleOptions: InputScaleOptions) {
  return {
    stacked: false,
    beginAtZero: true,
    title: false,
    max: scaleOptions.maxValue,
    grid: {
      drawOnChartArea: true,
      color: 'rgba(0, 0, 0, 0.1)',
      lineWidth: 1,

      drawBorder: true,
      borderColor: scaleOptions.isDarkPicture ? 'white' : 'black',
      borderWidth: 1,

      drawTicks: true,
      tickColor: 'transparent',
      tickLength: 2,
    },
    ticks: {
      font: {
        size: scaleOptions.fontWidth,
        weight: 'bold',
      },
      color: scaleOptions.isDarkPicture ? 'white' : 'black',
      textStrokeColor: 'black',
      textStrokeWidth: scaleOptions.strokeWidth,
      maxRotation: 0,
      stepSize: scaleOptions.maxValue as number / 4,
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
      boxWidth: 6,
      boxHeight: 0,
      font: {
        size: chartOptions.maxWidth / 40,
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
