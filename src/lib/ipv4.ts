const shifts = [3, 2, 1, 0].map((n) => n * 8);

// break down into 4 octets
export const disassemble = (address: number) => shifts.map((n) => (address >>> n) & 0xff);

// reverse disassemble
export const assemble = (octets: number[]) => {
  return octets.reduce((assembled, octet, idx) => {
    return (assembled + (octet << shifts[idx])) >>> 0;
  }, 0);
};

export type IPInfoMini = {
  prefix: number;
  address: number;
};

export type IPInfo = IPInfoMini & {
  network: number;
  mask: number;
  broadcast: number;
  min: number;
  max: number;
  hosts: number;
};

type CalcIPResult = IPInfo | IPInfoMini;

const toString = (addr: number) =>
  disassemble(addr)
    .map((n) => n.toString())
    .join('.');

export const render = (result: CalcIPResult) => {
  if ('network' in result) {
    const { address, network, mask, broadcast, min, max, hosts, prefix } = result;
    return {
      prefix: prefix.toString(),
      address: toString(address),
      network: `${toString(network)}/${prefix}`,
      mask: `${toString(mask)} = ${prefix}`,
      broadcast: toString(broadcast),
      min: toString(min),
      max: toString(max),
      hosts: hosts.toLocaleString(),
    };
  }

  const { address, prefix } = result;

  return {
    prefix: prefix.toString(),
    address: toString(address),
    network: '',
    broadcast: '',
    min: '',
    mask: '',
    max: '',
    hosts: '',
  };
};

export const calcHosts = (prefix: number) => {
  if (prefix === 0) return 0xffffffff - 1;

  const invertedPrefix = 32 - prefix;
  return ((1 << invertedPrefix) >>> 0) - 2;
};

// inspired by the usage of https://gitlab.com/ipcalc/ipcalc
export const calcIP = (address: number, prefix: number): CalcIPResult => {
  // early return of anomaly case of 32
  if (prefix === 32) {
    return {
      prefix,
      address,
    };
  }

  const invertedPrefix = 32 - prefix;
  const mask = prefix === 0 ? 0x0 : ((0xffffffff >>> invertedPrefix) << invertedPrefix) >>> 0;
  const network = (address & mask) >>> 0;
  const hosts = calcHosts(prefix);

  const [min, max, broadcast] = [1, hosts, hosts + 1].map((adjust) => network + adjust);

  const result = {
    prefix,
    address,
    network,
    mask,
    min,
    max,
    broadcast,
    hosts,
  };
  return result;
};

export const newAddressFrom = (address: number, mask: number, network: number) =>
  ((address & ~mask) >>> 0) + ((network & mask) >>> 0);

const patternToMatch = /^([0-9]{1,3}).([0-9]{1,3}).([0-9]{1,3}).([0-9]{1,3})\/([0-9]{1,2})$/;
// thanks to https://stackoverflow.com/a/36760050/1570165
const patternToTest = /^((25[0-5]|(2[0-4]|1\d|[1-9]|)\d)\.?\b){4}\/(3[0-2]|[1-2][0-9]|[0-9])$/;
// to be inserted as https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/pattern
export const pattern = patternToTest.toString().slice(1, -1);

const failed = { address: -1, prefix: -1 };

export const parseFrom = (text: string): { address: number; prefix: number; msg?: string } => {
  const passed = patternToTest.test(text);

  if (!passed) return failed;

  const matched = text.match(patternToMatch);

  if (!matched) return failed;

  const [a, b, c, d, prefix] = matched.slice(1).map((n) => Number(n));
  const address = assemble([a, b, c, d]);

  const succeeded = { address, prefix };

  if (prefix < 32) {
    return succeeded;
  }

  // avoid calculating 32 as prefix as it doesn't seem to be useful and complicate the logics and UI
  return { address, prefix: 31, msg: `Prefix ${prefix} stepped down to 31` };
};
