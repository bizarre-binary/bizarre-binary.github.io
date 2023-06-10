import { expect, describe, it } from 'vitest';
import { calcHosts, calcIP, assemble, parseFrom } from '../../src/lib/ipv4';

describe('parseFrom', () => {
  it('1.2.3.4/5', () => {
    expect(parseFrom('1.2.3.4/5')).toContain({ address: assemble([1, 2, 3, 4]), prefix: 5 });
  });

  it('255.255.255.255/32', () => {
    expect(parseFrom('255.255.255.255/32')).toContain({
      address: assemble([255, 255, 255, 255]),
      prefix: 32,
    });
  });

  it('255.255.255.255/33', () => {
    expect(parseFrom('255.255.255.255/33')).toContain({
      address: -1,
      prefix: -1,
    });
  });

  it('256.255.255.255/32', () => {
    expect(parseFrom('256.255.255.255/32')).toContain({
      address: -1,
      prefix: -1,
    });
  });

  it('255.256.255.255/32', () => {
    expect(parseFrom('255.256.255.255/32')).toContain({
      address: -1,
      prefix: -1,
    });
  });

  it('255.255.256.255/32', () => {
    expect(parseFrom('255.255.256.255/32')).toContain({
      address: -1,
      prefix: -1,
    });
  });

  it('255.255.255.256/32', () => {
    expect(parseFrom('255.255.255.256/32')).toContain({
      address: -1,
      prefix: -1,
    });
  });
});

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

  it('144.0.0.0', () => {
    expect(assemble([144, 0, 0, 0])).toBe(2415919104);
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
    expect(calcIP(assemble([0, 0, 0, 0]), prefix)).toEqual({
      address: assemble([0, 0, 0, 0]),
      hosts: calcHosts(prefix),
      network: assemble([0, 0, 0, 0]),
      mask: assemble([0, 0, 0, 0]),
      min: assemble([0, 0, 0, 1]),
      max: assemble([255, 255, 255, 254]),
      broadcast: assemble([255, 255, 255, 255]),
      prefix,
    });
  });
  it('255.255.255.255/32', () => {
    const prefix = 32;
    expect(calcIP(assemble([255, 255, 255, 255]), prefix)).toEqual({
      address: assemble([255, 255, 255, 255]),
      prefix,
    });
  });

  it('192.168.0.0/1', () => {
    const prefix = 1;
    expect(calcIP(assemble([192, 168, 0, 0]), prefix)).toEqual({
      address: assemble([192, 168, 0, 0]),
      hosts: calcHosts(prefix),
      network: assemble([128, 0, 0, 0]),
      mask: assemble([128, 0, 0, 0]),
      min: assemble([128, 0, 0, 1]),
      max: assemble([255, 255, 255, 254]),
      broadcast: assemble([255, 255, 255, 255]),
      prefix,
    });
  });

  it('192.1.1.127/25', () => {
    const prefix = 25;
    expect(calcIP(assemble([192, 1, 1, 127]), prefix)).toEqual({
      address: assemble([192, 1, 1, 127]),
      hosts: calcHosts(prefix),
      network: assemble([192, 1, 1, 0]),
      mask: assemble([255, 255, 255, 128]),
      min: assemble([192, 1, 1, 1]),
      max: assemble([192, 1, 1, 126]),
      broadcast: assemble([192, 1, 1, 127]),
      prefix,
    });
  });

  it('80.187.241.219/18', () => {
    const prefix = 18;
    expect(calcIP(assemble([80, 187, 241, 219]), prefix)).toEqual({
      address: assemble([80, 187, 241, 219]),
      hosts: calcHosts(prefix),
      network: assemble([80, 187, 192, 0]),
      mask: assemble([255, 255, 192, 0]),
      min: assemble([80, 187, 192, 1]),
      max: assemble([80, 187, 255, 254]),
      broadcast: assemble([80, 187, 255, 255]),
      prefix,
    });
  });

  it('132.172.13.228/9', () => {
    const prefix = 9;
    expect(calcIP(assemble([132, 172, 13, 228]), prefix)).toEqual({
      address: assemble([132, 172, 13, 228]),
      hosts: calcHosts(prefix),
      network: assemble([132, 128, 0, 0]),
      mask: assemble([255, 128, 0, 0]),
      min: assemble([132, 128, 0, 1]),
      max: assemble([132, 255, 255, 254]),
      broadcast: assemble([132, 255, 255, 255]),
      prefix,
    });
  });

  it('254.224.134.176/5', () => {
    const prefix = 5;
    expect(calcIP(assemble([254, 224, 134, 176]), prefix)).toEqual({
      address: assemble([254, 224, 134, 176]),
      hosts: calcHosts(prefix),
      network: assemble([248, 0, 0, 0]),
      mask: assemble([248, 0, 0, 0]),
      min: assemble([248, 0, 0, 1]),
      max: assemble([255, 255, 255, 254]),
      broadcast: assemble([255, 255, 255, 255]),
      prefix,
    });
  });

  it('75.99.179.34/22', () => {
    const prefix = 22;
    expect(calcIP(assemble([75, 99, 179, 34]), prefix)).toEqual({
      address: assemble([75, 99, 179, 34]),
      hosts: calcHosts(prefix),
      network: assemble([75, 99, 176, 0]),
      mask: assemble([255, 255, 252, 0]),
      min: assemble([75, 99, 176, 1]),
      max: assemble([75, 99, 179, 254]),
      broadcast: assemble([75, 99, 179, 255]),
      prefix,
    });
  });
  it('144.35.239.132/8', () => {
    const prefix = 8;
    expect(calcIP(assemble([144, 35, 239, 132]), prefix)).toEqual({
      prefix,
      address: assemble([144, 35, 239, 132]),
      hosts: calcHosts(prefix),
      network: assemble([144, 0, 0, 0]),
      mask: assemble([255, 0, 0, 0]),
      min: assemble([144, 0, 0, 1]),
      max: assemble([144, 255, 255, 254]),
      broadcast: assemble([144, 255, 255, 255]),
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
