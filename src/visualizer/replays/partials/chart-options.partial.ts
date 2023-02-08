import { Scale } from 'chart.js';
import { decimateTicks } from '../../utils/chart.util';

export function getReplayChartOptions(w: number, h: number, points: number, isDarkPicture: boolean): any {
  return {
    ...getBaseChartOptions(),
    scales: getReplayChartScales(w, h, points, isDarkPicture),
    plugins: getReplayChartPlugins(w, isDarkPicture),
  };
}

function getReplayChartScales(w: number, h: number, points: number, isDarkPicture: boolean) {
  return {
    x: getReplayChartScalesX(w, points, isDarkPicture),
    y: getReplayChartScalesY(h),
  };
}

function getReplayChartScalesX(w: number, points: number, isDarkPicture: boolean) {
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

function getReplayChartScalesY(h: number) {
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

function getReplayChartPlugins(w: number, isDarkPicture: boolean) {
  const legend = {
    position: 'top',
    align: 'end',
    labels: {
      color: isDarkPicture ? 'white' : 'black',
      boxWidth: 9,
      boxHeight: 2,
      padding: 8,
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
