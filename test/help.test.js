import { expect, it } from 'vitest';
import generateHelp from '../lib/help';

it('--help', () => {
  const result = generateHelp();
  expect(result).toMatchSnapshot();
});
