<h1 align="center">
  result4js
</h1>
<p align="center"> <em>Liberation from annoying try-catch blocks</em>
</p>

![NPM Version](https://img.shields.io/npm/v/result4js)
![NPM Downloads](https://img.shields.io/npm/dm/result4js)


## Highlights
- Type-safe error handling
- Similar to Rust's [`std::Result`](https://doc.rust-lang.org/std/result/)
- No more `try-catch` blocks
- No dependencies

## Install
```sh
npm i result4js
yarn add result4js
pnpm add result4js
```

## Usage
```ts
import { Err, Ok, type Result } from "result4js";

function sum(a: any, b: any): Result<number, string> {
    if (typeof a !== "number" || typeof b !== "number") return Err("Both arguments are not numbers");
    return Ok(a + b);
}

const goodResult = sum(1, 2); // Success(3)
const badResult = sum("1", 2); // Failure("Both arguments are not numbers")

// Handle results with type checking
if (goodResult.isErr()) {
  // Handle error case
  return;
}
const goodData = goodResult.data; // 3

// Or use helper methods

// Throws the error if the result is Failure
// Only use this when you're absolutely certain the operation will succeed
const badData = badResult.throw();

// Provide a fallback value
// This is always safe
const badData = badResult.or(0); // 0
```