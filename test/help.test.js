import { expect, it } from 'vitest'
import generateHelp from 'micro-dev/src/lib/help'

it('--help', () => {
  const result = generateHelp()
  expect(result).toMatchSnapshot()
})
