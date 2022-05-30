import { Canvas, Image } from 'skia-canvas';
import { loadImage } from 'canvas';
import { BackgroundImagePlugin } from '../plugins/background-image.plugin';

export async function getStrainChartPlugins(w: number, h: number, imageURL: string | null): Promise<any[]> {
  const plugins = [
    await getBackgroundImagePlugin(w, h, imageURL),
  ];

  return plugins.filter((x) => x);
}

function getBackgroundImagePlugin(w: number, h: number, imageURL: string | null): any {
  if (!imageURL) return null;

  const image = new Image();
  const canvas = new Canvas(w, h);
  const ctx = canvas.getContext('2d');

  return new Promise((res) => {
    image.onload = async () => {
      ctx.filter = 'blur(4px) brightness(65%) contrast(108%) saturate(110%)';
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
