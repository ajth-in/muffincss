import { describe, test } from '@jest/globals';
import { postcssPipeline } from './utils';

describe('Reset options', () => {
  test('Should transform all media classNames to atomic styles, should not purge media at rules with unprocessed rules', async () => {
    await postcssPipeline(
      'src/tests/resets/input.test.css',
      'src/tests/resets/default.test.css',
    );
  });
});
