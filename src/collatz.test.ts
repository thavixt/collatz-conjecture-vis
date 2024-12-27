import {expect, test} from 'vitest'
import {getCollatzSeries} from './collatz'

test('getCollatzSeries', () => {
  expect(getCollatzSeries(1)).toEqual([1])
  expect(getCollatzSeries(2)).toEqual([2, 1])
  expect(getCollatzSeries(3)).toEqual([3, 10, 5, 16, 8, 4, 2, 1])
  expect(getCollatzSeries(4)).toEqual([4, 2, 1])
  expect(getCollatzSeries(5)).toEqual([5, 16, 8, 4, 2, 1])
  expect(getCollatzSeries(6)).toEqual([6, 3, 10, 5, 16, 8, 4, 2, 1])
  expect(getCollatzSeries(7)).toEqual([7, 22, 11, 34, 17, 52, 26, 13, 40, 20, 10, 5, 16, 8, 4, 2, 1])
  expect(getCollatzSeries(8)).toEqual([8, 4, 2, 1])
  expect(getCollatzSeries(9)).toEqual([9, 28, 14, 7, 22, 11, 34, 17, 52, 26, 13, 40, 20, 10, 5, 16, 8, 4, 2, 1])
  expect(getCollatzSeries(10)).toEqual([10, 5, 16, 8, 4, 2, 1])
})