import { describe, expect, test } from "vitest";

import { Err, Ok, type Result } from "../src";

describe("Result", () => {
    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    function sum(a: any, b: any): Result<number, string> {
        if (typeof a !== "number" || typeof b !== "number")
            return Err("Both arguments are not numbers");
        return Ok(a + b);
    }

    const data = [
        [1, 2, 3],
        [3, 4, 7],
        ["a", 2, "Both arguments are not numbers"],
        [1, "b", "Both arguments are not numbers"],
        ["a", "b", "Both arguments are not numbers"],
        [1, "2", "Both arguments are not numbers"],
    ];

    for (const [a, b, c] of data) {
        test(`sum(${a}, ${b})`, () => {
            const result = sum(a, b);
            const isOk = result.isOk();

            if (isOk) expect(c).not.toBe("Both arguments are not numbers");
            if (!isOk) expect(c).toBe("Both arguments are not numbers");
            expect(result.or(0)).toBe(
                c === "Both arguments are not numbers"
                    ? 0
                    : (a as number) + (b as number),
            );

            try {
                expect(result.throw()).toBe(c);
            } catch (error) {
                expect(error).toBe(c);
            }
        });
    }
});
