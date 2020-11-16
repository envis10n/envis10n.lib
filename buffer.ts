import { u8, u16 } from "./numerics.ts";

/**
 * A generic interface for a class to implement memory-esque functionality.
 */
export interface Memory {
  /**
   * Read a single byte.
   * @param address The address to read this byte from.
   */
  read(address: Number): u8;
  /**
   * Read 2 bytes in LE order as a 16-bit number.
   * @param address The address to start reading bytes from.
   */
  read_u16(address: Number): u16;
  /**
   * Write a single byte at a specific address.
   * @param address The address to write to.
   * @param data The value to write. Is converted to a u8 before writing.
   */
  write(address: Number, data: Number): void;
  /**
   * Writes 2 bytes in LE order beginning at the specified address.
   * @param address The address to begin writing to.
   * @param data The value to write. Is converted to a u16 before writing.
   */
  write_u16(address: Number, data: Number): void;
  /**
   * Copy a block of data from an array.
   * @param src The array to copy from.
   * @param offset The offset to start copying to.
   * @param srcOffset The offset to start reading from.
   * @param end The offset to stop reading from.
   */
  copy(src: ArrayLike<Number>, offset: Number, srcOffset?: Number, end?: Number): void;
  len(): number;
}

/**
 * A buffer backed by a Uint8Array that implements Memory and can read and write u8 and u16 values.
 */
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
  public copy(src: ArrayLike<Number>, offset: Number, srcOffset: Number = 0, count: Number = src.length) {
    const doff = new u16(offset);
    const soff = new u16(srcOffset);
    const send = new u16(count).add(soff);
    for (let i = soff.valueOf(); i < send.valueOf(); i++) {
      this.write(doff.add(i - soff.valueOf()), src[i]);
    }
  }
  public len(): number {
    return this._back.length;
  }
  public static block_copy(src: Buffer, dst: Buffer, srcOffset: Number = 0, dstOffset: Number = 0, count: Number = src.len()) {
    const doff = new u16(dstOffset);
    const soff = new u16(srcOffset);
    const cnt = new u16(count);
    for (let i = soff.valueOf(); i < soff.add(cnt).valueOf(); i++) {
      dst.write(doff.add(i - soff.valueOf()), src.read(i));
    }
  }
  public clone(): Buffer {
    return new Buffer(this._back);
  }
}