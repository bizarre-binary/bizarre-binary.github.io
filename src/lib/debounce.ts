import { delay } from './defaults';
import _debounce from 'lodash-es/debounce';

/* eslint-disable @typescript-eslint/no-explicit-any */
type anyf = (...args: any) => any;

// customize debounce to work better by few options
export const debounce = (fn: anyf) =>
  _debounce(fn, delay.wait, {
    leading: true, // this makes no wait for the first fire
    maxWait: delay.wait, // to give the illusion of no debounce by continuously feeding changes with the interval of `delay.wait` in the middle
  });
