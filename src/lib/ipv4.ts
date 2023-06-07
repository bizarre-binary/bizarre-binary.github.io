const shifts = [3, 2, 1, 0].map((n) => n * 8);

// break down into 4 octets
export const disassemble = (address: number) => shifts.map((n) => (address >>> n) & 0xff);

// reverse disassemble
export const assemble = (octets: number[]) => {
  return octets.reduce((assembled, octet, idx) => {
    return (assembled + (octet << shifts[idx])) >>> 0;
  }, 0);
};

export type IPInfo = {
  prefix: number;
  address: number;
  network: number;
  mask: number;
  broadcast: number;
  min: number;
  max: number;
  hosts: number;
};

type CalcIPResult =
  | IPInfo
  | {
      prefix: number;
      address: number;
    };

const toString = (addr: number) =>
  disassemble(addr)
    .map((n) => n.toString())
    .join('.');

export const render = ({ address, network, mask, broadcast, min, max, hosts, prefix }: IPInfo) => {
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
