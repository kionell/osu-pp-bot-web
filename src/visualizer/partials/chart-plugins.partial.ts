import { Canvas, Image } from 'skia-canvas';
import { loadImage } from 'canvas';
import { BackgroundImagePlugin } from '../plugins/background-image.plugin';
import { DatasetBlendingPlugin } from '../plugins/dataset-blending-plugin';

export async function getStrainChartPlugins(w: number, h: number, imageURL: string | null): Promise<any[]> {
  const plugins = [
    await getBackgroundImagePlugin(w, h, imageURL),
    await getDatasetBlendingPlugin(),
  ];

  return plugins.filter((x) => x);
}

async function getBackgroundImagePlugin(w: number, h: number, imageURL: string | null): Promise<BackgroundImagePlugin | null> {
  if (!imageURL) return null;

  const image = new Image();
  const canvas = new Canvas(w, h);
  const ctx = canvas.getContext('2d');

  return new Promise((res) => {
    image.onload = async () => {
      ctx.filter = 'blur(2px) brightness(35%) contrast(108%) saturate(110%)';
      ctx.drawImage(image, -5, -5, w + 5, h + 5);

      // Super weird stuff, but it is a way to create filtered images.
      const buffer = await canvas.toBuffer('png');
      const filtered = await loadImage(buffer);

      res(new BackgroundImagePlugin(filtered));
    };

    image.onerror = () => res(null);

    image.src = imageURL;
  });
}

async function getDatasetBlendingPlugin(): Promise<DatasetBlendingPlugin> {
  return new DatasetBlendingPlugin();
}
