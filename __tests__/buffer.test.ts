import { assertEquals, assertNotStrictEquals } from "https://deno.land/std@0.77.0/testing/asserts.ts";
import { Buffer } from "../buffer.ts";
import { u8 } from "../numerics.ts";

Deno.test("buffer_write_read", () => {
  const buf = new Buffer(16);
  buf.write(0, 8);
  const a = buf.read(0);
  assertEquals(a.valueOf(), 8);
});

Deno.test("buffer_write_read_u16", () => {
  const buf = new Buffer(16);
  buf.write_u16(1, 512);
  const b = buf.read_u16(1);
  assertEquals(b.valueOf(), 512);
});

Deno.test("buffer_block_copy", () => {
  const buf = new Buffer(16);
  buf.block_copy([10, 20, 30], 3);
  const c = [buf.read(3), buf.read(4), buf.read(5)];
  assertEquals<u8[]>(c, [new u8(10), new u8(20), new u8(30)]);
});

Deno.test("buffer_block_copy_offset", () => {
  const buf = new Buffer(16);
  buf.block_copy([10, 20, 30], 0, 2);
  const c = buf.read(0);
  assertEquals(c.valueOf(), 30);
});

Deno.test("buffer_clone", () => {
  const buf = new Buffer(16);
  const buf2 = buf.clone();
  assertNotStrictEquals<Buffer>(buf, buf2);
});