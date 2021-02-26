import { join } from 'path';

const b = 'test';

// << my-section
console.log(join(b));
// my-section

const c = 2 + 2;

export function test(param: string): string {
  const d = 123;

  // << other

  console.log('other', c);
  return param + c + d;

  // other
}
