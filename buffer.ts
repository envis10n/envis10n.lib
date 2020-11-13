import { u8, u16 } from "./numerics.ts";

export interface Memory {
  read(address: Number): u8;
  read_u16(address: Number): u16;
  write(address: Number, data: Number): void;
  write_u16(address: Number, data: Number): void;
  block_copy(src: ArrayLike<Number>, offset?: Number, end?: Number): void;
  clone(): Memory;
}

export class Buffer implements Memory {
  private readonly _back: Uint8Array;
  constructor(size: number);
  constructor(bytes: Uint8Array);
  constructor(sizeOrBytes: number | Uint8Array) {
    if (sizeOrBytes instanceof Uint8Array) {
      this._back = sizeOrBytes.slice();
    } else {
      this._back = new Uint8Array(sizeOrBytes);
    }
  }
  public read(address: Number): u8 {
    const addr: u16 = new u16(address);
    return new u8(this._back[addr.valueOf()]);
  }
  public read_u16(address: Number): u16 {
    const addr: u16 = new u16(address);
    const a = this.read(addr);
    const b = this.read(addr.add(1));
    return u16.from_le(a, b);
  }
  public write(address: Number, data: Number) {
    const addr: u16 = new u16(address);
    this._back[addr.valueOf()] = data.valueOf();
  }
  public write_u16(address: Number, data: Number) {
    const addr: u16 = new u16(address);
    const d: u16 = new u16(data.valueOf());
    const s = d.split();
    this.write(addr, s[0]);
    this.write(addr.add(1), s[1]);
  }
  public block_copy(src: ArrayLike<Number>, offset: Number, srcOffset: Number = 0, end: Number = src.length) {
    const doff = new u16(offset);
    const soff = new u16(srcOffset);
    const send = new u16(end);
    for (let i = soff.valueOf(); i < send.valueOf(); i++) {
      this.write(doff.add(i - soff.valueOf()), src[i]);
    }
  }
  public clone(): Buffer {
    return new Buffer(this._back);
  }
}