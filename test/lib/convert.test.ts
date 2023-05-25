import { expect, test } from 'vitest';
import { toRGBA, fromRGBA } from '../../src/lib/convert';

test('toRGBA()', () => {
  expect(toRGBA(0xffeeddcc)).toEqual({ r: 0xff, g: 0xee, b: 0xdd, a: 0xcc });
});

test('fromRGBA()', () => {
  expect(fromRGBA({ r: 0xff, g: 0xee, b: 0xdd, a: 0xcc })).toEqual(0xffeeddcc);
});
