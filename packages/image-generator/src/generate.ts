import { join } from 'node:path';
import svg2img from 'svg2img';
import { svgTemplate } from './svg-template';

export async function generate(domain: string) {
  // biome-ignore lint/suspicious/noAsyncPromiseExecutor: <explanation>
  return new Promise<Buffer>(async (resolve, reject) => {
    const imageFinal = svgTemplate.replace('{{name}}', domain);

    svg2img(
      imageFinal,
      {
        resvg: {
          font: {
            loadSystemFonts: false,
            fontFiles: [join(__dirname, '/fonts/Inter-SemiBold.ttf')],
          },
        },
      },
      async (error, buffer) => {
        if (error) {
          reject(error);
          return;
        }
        resolve(buffer);
      }
    );
  });
}
