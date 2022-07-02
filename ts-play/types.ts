// Inspired by Rust's Option and Result enums
// and this video https://youtu.be/fhyHgkH0ZEg
// for better null safety and error handling

/* Option */

export function Some<T>(value: T): Some<T> {
  return {
    type: "some",
    value,
    unwrap,
  };
}

export const None: None = {
  type: "none",
  unwrap,
};

export type Option<T> = Some<T> | None;

export interface Some<T> extends Good<T> {
  type: "some";
}

export interface None extends Bad {
  type: "none";
}

/* Result */

export function Ok<T>(value: T): Ok<T> {
  return {
    type: "ok",
    value,
    unwrap,
  };
}

export function Err<E extends Error>(error: E): Err<E> {
  return {
    type: "err",
    error,
    unwrap,
  };
}

export type Result<T, E extends Error = Error> = Ok<T> | Err<E>;

export interface Ok<T> extends Good<T> {
  type: "ok";
}

export interface Err<E extends Error> extends Bad {
  type: "err";
  error: E;
}

/* Base (private) */

function unwrap<T>(this: Good<T> | Bad): T {
  if ("value" in this) {
    return this.value;
  } else {
    throw new TypeError(`Cannot unwrap obj of type "${this.type}": ${this}`);
  }
}

interface Good<T> {
  readonly type: string;
  readonly value: T;
  unwrap(): T;
}

interface Bad {
  readonly type: string;
  unwrap(): never;
}
