/**
 * Represents a result of an operation that can be either successful or failed.
 * - Intended to be used as a return value of a function.
 * @typeparam S The type of the success value.
 * @typeparam E The type of the error value.
 * @example
 * ```ts
 * function sum(a: any, b: any): Result<number, string> {
 *    if (typeof a !== "number" && typeof b !== "number") return Err("Both arguments are not numbers");
 *    return Ok(a + b);
 * }
 * ```
 */
type Result<S, E> = Success<S, E> | Failure<S, E>;

/**
 * @internal
 */
abstract class Base<S, E> {
    constructor(protected data: S | E) {}

    /**
     * Extracts the success value from the `Result` instance with throwing an error if the result is failed.
     * - **NOTE:**
     * - When throwing `data` in `Failure`, it is not wrapped in an `Error` class.
     * - Note the behavior when `data` does not extend the `Error` class.
     * - https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/throw#description
     * @returns The success value.
     * @throws The error value if the result is failed.
     * @example
     * ```ts
     * function sum(a: any, b: any): Result<number, string> {
     *     if (typeof a !== "number" && typeof b !== "number") return Err("Both arguments are not numbers");
     *     return Ok(a + b);
     * }
     *
     * const result = sum(1, 2).throw(); // 3
     * const result = sum("a", 2).throw(); // Error: Both arguments are not numbers
     * ```
     */
    abstract throw(): S;

    /**
     * Extracts the success value from the `Result` instance, throwing a mapped error if the result is failed.
     * - **NOTE:**
     * - When throwing `data` in `Failure`, it is not wrapped in an `Error` class.
     * - Note the behavior when `data` does not extend the `Error` class.
     * - https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/throw#description
     * @param mapper The function or string to be used to map the error value.
     * @example
     * ```ts
     * function sum(a: any, b: any): Result<number, string> {
     *     if (typeof a !== "number" && typeof b !== "number") return Err("Both arguments are not numbers");
     *     return Ok(a + b);
     * }
     *
     * const result = sum(1, 2).throwMap("This is likely a bug. Please report it on GitHub issues"); // It will throw an error with the message
     * const result = sum("a", 2).throwMap((error) => new CustomError(error)); // CustomError: Both arguments are not numbers
     * ```
     */
    abstract throwMap(mapper: string | ((data: E) => unknown)): S;

    /**
     * Extracts the success value from the `Result` instance with returning a default value if the result is failed.
     * @param defaultValue The default value to be returned if the result is failed.
     * @returns The success value if the result is successful, otherwise the default value.
     * @example
     * ```ts
     * function sum(a: any, b: any): Result<number, string> {
     *    if (typeof a !== "number" && typeof b !== "number") return Err("Both arguments are not numbers");
     *    return Ok(a + b);
     * }
     *
     * const result = sum(1, 2).or(0); // 3
     * const result = sum("a", 2).or(0); // 0
     * ```
     */
    abstract or(defaultValue: S): S;

    abstract isOk(): this is Success<S, E>;

    abstract isErr(): this is Failure<S, E>;
}

/**
 * Represents a successful result of an operation.
 * - It is exported only as type definitions.
 * - Use `Ok` function to create an instance of this class.
 * @internal This class is internal and should not be used directly.
 */
class Success<S, E> extends Base<S, E> {
    private readonly _tag = "Success";

    constructor(public data: S) {
        super(data);
    }

    throw(): S {
        return this.data;
    }

    throwMap(mapper: string | ((data: E) => unknown)): S {
        return this.data;
    }

    or(defaultValue: S): S {
        return this.data;
    }

    isOk(): this is Success<S, E> {
        return true;
    }

    isErr(): this is Failure<S, E> {
        return false;
    }
}

/**
 * Represents a failed result of an operation.
 * - It is exported only as type definitions.
 * - Use `Err` function to create an instance of this class.
 * @internal This class is internal and should not be used directly.
 */
class Failure<S, E> extends Base<S, E> {
    private readonly _tag = "Failure";

    constructor(public data: E) {
        super(data);
    }

    throw(): S {
        throw this.data;
    }

    throwMap(mapper: string | ((data: E) => unknown)): S {
        if (typeof mapper === "function") throw mapper(this.data);
        throw mapper;
    }

    or(defaultValue: S): S {
        return defaultValue;
    }

    isOk(): this is Success<S, E> {
        return false;
    }

    isErr(): this is Failure<S, E> {
        return true;
    }
}

/**
 * Creates a new instance of `Success` class.
 * @param data The data to be wrapped in the `Success` class.
 * @returns A new instance of `Success` class.
 * @example
 * ```ts
 * function sum(a: any, b: any): Result<number, string> {
 *    if (typeof a !== "number" && typeof b !== "number") return Err("Both arguments are not numbers");
 *    return Ok(a + b);
 * }
 * ```
 */
function Ok<S, E = unknown>(data: S): Success<S, E> {
    return new Success(data);
}

/**
 * Creates a new instance of `Failure` class.
 * @param error The error to be wrapped in the `Failure` class.
 * @returns A new instance of `Failure` class.
 * @example
 * ```ts
 * function sum(a: any, b: any): Result<number, string> {
 *    if (typeof a !== "number" && typeof b !== "number") return Err("Both arguments are not numbers");
 *    return Ok(a + b);
 * }
 * ```
 */
function Err<E, S = unknown>(error: E): Failure<S, E> {
    return new Failure(error);
}

export { type Result, type Success, type Failure, Ok, Err };
