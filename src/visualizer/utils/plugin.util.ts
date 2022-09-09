import { Canvas, Image } from 'skia-canvas';
import { loadImage } from 'canvas';
import { BackgroundImagePlugin } from '../plugins/background-image.plugin';
import { DatasetBlendingPlugin } from '../plugins/dataset-blending-plugin';
import { VerticalGradientPlugin } from '../plugins/vertical-gradient.plugin';

export async function getBackgroundImagePlugin(w: number, h: number, imageURL: string | null): Promise<BackgroundImagePlugin> {
  if (!imageURL) {
    return new BackgroundImagePlugin(null);
  }

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

    image.onerror = () => {
      res(new BackgroundImagePlugin(null));
    };

    image.src = imageURL;
  });
}

export async function getDatasetBlendingPlugin(): Promise<DatasetBlendingPlugin> {
  return new DatasetBlendingPlugin();
}

export async function getVerticalGradientPlugin(colors: string[][]): Promise<VerticalGradientPlugin> {
  return new VerticalGradientPlugin(colors);
}
