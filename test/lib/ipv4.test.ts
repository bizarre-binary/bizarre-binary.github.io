import { expect, describe, it } from 'vitest';
import { calcHosts, calcIP, assemble } from '../../src/lib/ipv4';

describe('assemble', () => {
  it('0.0.0.0', () => {
    expect(assemble([0, 0, 0, 0])).toBe(0x00000000);
  });

  it('255.255.255.255', () => {
    expect(assemble([255, 255, 255, 255])).toBe(0xffffffff);
  });

  it('1.2.3.4', () => {
    expect(assemble([1, 2, 3, 4])).toBe(0x01020304);
  });

  it('192.168.0.0', () => {
    expect(assemble([192, 168, 0, 0])).toBe(0xc0a80000);
  });
});

describe('calcHosts', () => {
  it('/1', () => {
    [1, 3, 10, 13, 19, 20, 24, 29, 31].forEach((prefix) => {
      expect(calcHosts(prefix)).toBe(((1 << (32 - prefix)) >>> 0) - 2);
    });
  });
});

describe('calcIP', () => {
  it('0.0.0.0/0', () => {
    const prefix = 0;
    expect(calcIP(assemble([0, 0, 0, 0]), prefix, false)).toEqual({
      address: [0, 0, 0, 0],
      hosts: calcHosts(prefix),
      network: [0, 0, 0, 0],
      mask: [0, 0, 0, 0],
      min: [0, 0, 0, 1],
      max: [255, 255, 255, 254],
      broadcast: [255, 255, 255, 255],
      prefix,
    });
  });
  it('255.255.255.255/32', () => {
    const prefix = 32;
    expect(calcIP(assemble([255, 255, 255, 255]), prefix, false)).toEqual({
      address: [255, 255, 255, 255],
      prefix,
    });
  });

  it('192.168.0.0/1', () => {
    const prefix = 1;
    expect(calcIP(assemble([192, 168, 0, 0]), prefix, false)).toEqual({
      address: [192, 168, 0, 0],
      hosts: calcHosts(prefix),
      network: [128, 0, 0, 0],
      mask: [128, 0, 0, 0],
      min: [128, 0, 0, 1],
      max: [255, 255, 255, 254],
      broadcast: [255, 255, 255, 255],
      prefix,
    });
  });

  it('192.1.1.127/25', () => {
    const prefix = 25;
    expect(calcIP(assemble([192, 1, 1, 127]), prefix, false)).toEqual({
      address: [192, 1, 1, 127],
      hosts: calcHosts(prefix),
      network: [192, 1, 1, 0],
      mask: [255, 255, 255, 128],
      min: [192, 1, 1, 1],
      max: [192, 1, 1, 126],
      broadcast: [192, 1, 1, 127],
      prefix,
    });
  });

  it('80.187.241.219/18', () => {
    const prefix = 18;
    expect(calcIP(assemble([80, 187, 241, 219]), prefix, false)).toEqual({
      address: [80, 187, 241, 219],
      hosts: calcHosts(prefix),
      network: [80, 187, 192, 0],
      mask: [255, 255, 192, 0],
      min: [80, 187, 192, 1],
      max: [80, 187, 255, 254],
      broadcast: [80, 187, 255, 255],
      prefix,
    });
  });

  it('132.172.13.228/9', () => {
    const prefix = 9;
    expect(calcIP(assemble([132, 172, 13, 228]), prefix, false)).toEqual({
      address: [132, 172, 13, 228],
      hosts: calcHosts(prefix),
      network: [132, 128, 0, 0],
      mask: [255, 128, 0, 0],
      min: [132, 128, 0, 1],
      max: [132, 255, 255, 254],
      broadcast: [132, 255, 255, 255],
      prefix,
    });
  });

  it('254.224.134.176/5', () => {
    const prefix = 5;
    expect(calcIP(assemble([254, 224, 134, 176]), prefix, false)).toEqual({
      address: [254, 224, 134, 176],
      hosts: calcHosts(prefix),
      network: [248, 0, 0, 0],
      mask: [248, 0, 0, 0],
      min: [248, 0, 0, 1],
      max: [255, 255, 255, 254],
      broadcast: [255, 255, 255, 255],
      prefix,
    });
  });

  it('75.99.179.34/22', () => {
    const prefix = 22;
    expect(calcIP(assemble([75, 99, 179, 34]), prefix, false)).toEqual({
      address: [75, 99, 179, 34],
      hosts: calcHosts(prefix),
      network: [75, 99, 176, 0],
      mask: [255, 255, 252, 0],
      min: [75, 99, 176, 1],
      max: [75, 99, 179, 254],
      broadcast: [75, 99, 179, 255],
      prefix,
    });
  });
  it('144.35.239.132/8', () => {
    const prefix = 8;
    expect(calcIP(assemble([144, 35, 239, 132]), prefix, false)).toEqual({
      address: [144, 35, 239, 132],
      hosts: calcHosts(prefix),
      network: [144, 0, 0, 0],
      mask: [255, 0, 0, 0],
      min: [144, 0, 0, 1],
      max: [144, 255, 255, 254],
      broadcast: [144, 255, 255, 255],
      prefix,
    });
  });
});

// use these to gen random IP notations
// const get0to255 = () => Math.floor(Math.random() * 256);
// const get0to32 = () => Math.floor(Math.random() * 32);
// const getIP = () => [get0to255(), get0to255(), get0to255(), get0to255(), get0to32()];
// [...Array(5)].forEach(() => {
//   const [a, b, c, d, p] = getIP();
//   console.log(`${a}.${b}.${c}.${d}/${p}`);
// });
