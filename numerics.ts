function wrap(value: number, max: number, min: number): number {
  value = Math.round(value);
  while (value > max || value < min) {
    value = value > max ? value - (max + 1) : value < min ? value + (max + 1) : value;
  }
  return value;
}

function wrap_u8(value: number = 0): number {
  return wrap(value, 255, 0);
}

function wrap_u16(value: number = 0): number {
  return wrap(value, 65535, 0);
}

function split_u16(u: u16): [u8, u8] {
  let v1 = u.rshift(8);
  let v2 = v1.and(u);
  return [v2.as_u8(), v1.as_u8()]; // LE ordering
}

export class u16 extends Number {
  constructor(value?: Number) {
    super(wrap_u16(value?.valueOf()));
  }
  public add(value: Number): u16 {
    return new u16(this.valueOf() + value.valueOf());
  }
  public sub(value: Number): u16 {
    return new u16(this.valueOf() - value.valueOf());
  }
  public neg(): u16 {
    return new u16(-this.valueOf());
  }
  public clone(): u16 {
    return new u16(this.valueOf());
  }
  public static MAX(): u16 {
    return new u16(65535);
  }
  public static MIN(): u16 {
    return new u16();
  }
  public xor(b: Number): u16 {
    return new u16(this.valueOf() ^ b.valueOf());
  }
  public not(): u16 {
    return new u16(~this.valueOf());
  }
  public or(b: Number): u16 {
    return new u16(this.valueOf() | b.valueOf());
  }
  public and(b: Number): u16 {
    return new u16(this.valueOf() & b.valueOf());
  }
  public rshift(b: Number): u16 {
    return new u16(this.valueOf() >> b.valueOf());
  }
  public lshift(b: Number): u16 {
    return new u16(this.valueOf() << b.valueOf());
  }
  public static from_be(...be: Number[]): u16 {
    return u16.from_le(be[1], be[0]);
  }
  public static from_le(...le: Number[]): u16 {
    return new u16((le[1].valueOf() << 8) | le[0].valueOf());
  }
  public split(): [u8, u8] {
    return split_u16(this);
  }
  public as_u8(): u8 {
    return new u8(this.valueOf());
  }
}

export class u8 extends Number {
  constructor(value?: Number) {
    super(wrap_u8(value?.valueOf()));
  }
  public static MAX(): u8 {
    return new u8(255);
  }
  public static MIN(): u8 {
    return new u8();
  }
  public add(value: Number): u8 {
    return new u8(this.valueOf() + value.valueOf());
  }
  public sub(value: Number): u8 {
    return new u8(this.valueOf() - value.valueOf());
  }
  public neg(): u8 {
    return new u8(-this.valueOf());
  }
  public mul(b: Number): u8 {
    return new u8(this.valueOf() * b.valueOf());
  }
  public div(b: Number): u8 {
    return new u8(this.valueOf() / b.valueOf());
  }
  public clone(): u8 {
    return new u8(this.valueOf());
  }
  public as_u16(): u16 {
    return new u16(this.valueOf());
  }
  public xor(b: Number): u8 {
    return new u8(this.valueOf() ^ b.valueOf());
  }
  public not(): u8 {
    return new u8(~this.valueOf());
  }
  public or(b: Number): u8 {
    return new u8(this.valueOf() | b.valueOf());
  }
  public and(b: Number): u8 {
    return new u8(this.valueOf() & b.valueOf());
  }
  public rshift(b: Number): u16 {
    return new u16(this.valueOf() >> b.valueOf());
  }
  public lshift(b: Number): u16 {
    return new u16(this.valueOf() << b.valueOf());
  }
}