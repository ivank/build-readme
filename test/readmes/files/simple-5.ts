import { join } from 'path';

const b = 'test';

// << my-full-section
// << my-section
console.log(join(b));
// my-section

// << my-section-2
const c = 2 + 2;
// my-section-2
// my-full-section
