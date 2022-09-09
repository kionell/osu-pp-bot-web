import { Scale } from 'chart.js';
import { decimateTicks } from '../../utils/chart.util';

export function getStrainChartOptions(w: number, h: number, points: number, isDarkPicture: boolean): any {
  return {
    ...getBaseChartOptions(),
    scales: getStrainChartScales(w, h, points, isDarkPicture),
    plugins: getStrainChartPlugins(w, isDarkPicture),
  };
}

function getStrainChartScales(w: number, h: number, points: number, isDarkPicture: boolean) {
  return {
    x: getStrainChartScalesX(w, points, isDarkPicture),
    y: getStrainChartScalesY(h),
  };
}

function getStrainChartScalesX(w: number, points: number, isDarkPicture: boolean) {
  return {
    grid: {
      drawOnChartArea: true,
      color: isDarkPicture ? 'white' : 'black',
      lineWidth: 1,

      drawBorder: true,
      borderColor: isDarkPicture ? 'white' : 'black',
      borderWidth: 1,

      drawTicks: true,
      tickLength: 4,
    },
    ticks: {
      font: {
        size: w / 45,
        weight: 'bold',
      },
      color: isDarkPicture ? 'white' : 'black',
      textStrokeColor: 'black',
      textStrokeWidth: w / 1125,
      maxRotation: 0,
    },
    afterBuildTicks: (axis: Scale) => {
      axis.ticks = decimateTicks(axis.ticks);
    },
  };
}

function getStrainChartScalesY(h: number) {
  return {
    stacked: false,
    beginAtZero: true,
    title: false,
    max: h,
    grid: {
      color: 'rgba(0, 0, 0, 0.1)',
      drawTicks: false,
      display: true,
    },
    ticks: {
      display: false,
    },
  };
}

function getStrainChartPlugins(w: number, isDarkPicture: boolean) {
  const legend = {
    position: 'top',
    align: 'end',
    labels: {
      color: isDarkPicture ? 'white' : 'black',
      boxWidth: 6,
      boxHeight: 0,
      font: {
        size: w / 40,
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
