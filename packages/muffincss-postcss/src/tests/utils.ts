import { promises as fs } from 'fs';
import postcss from 'postcss';
import postcssAtomizer from '..';
// @ts-ignore
import Prettier from 'postcss-prettify';
export async function postcssPipeline(
  inputRelativePath: string,
  outputRelativePath: string,
  transformOut?: (input: string) => string,
) {
  const inputCss = await fs.readFile(inputRelativePath, 'utf8');

  const result = await postcss([postcssAtomizer(), Prettier()]).process(
    inputCss,
    {
      from: undefined,
    },
  );

  expect(result.warnings()).toHaveLength(0);

  const expectedCss = await fs.readFile(outputRelativePath, 'utf8');

  const processedCssNormalized = result.css.replace(/\s+/g, '');
  const expectedCssNormalized = expectedCss.replace(/\s+/g, '');

  expect(processedCssNormalized).toBe(
    transformOut?.(expectedCssNormalized) ?? expectedCssNormalized,
  );
}
