import { expect, it } from 'vitest'
import generateHelp from '../packages/micro-dev/src/lib/help'

it('--help', () => {
  const result = generateHelp()
  expect(result).toMatchSnapshot()
})
