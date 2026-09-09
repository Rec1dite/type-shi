//---------- Covariance ----------//
// When the generic parameter is _produced_ as a value by the instantiated type
type Covar<T> = T[];

// Covar<'hello'> is assignable to Covar<string>
// 'hello' is a subtype of string
const co_ok: Covar<string> = ['hi'];

// Covar<string> is not assignable to Covar<'hello'>
const co_bad: Covar<'hello'> = ['hi', 'world'] as Covar<string>;

//---------- Contravariance ----------//
// When the generic parameter is _consumed_ as a value by the instantiated type
type Contravar<T> = (x: T) => void;

// Contravar<string> is assignable to Contravar<'hi'>
// 'hi' is a subtype of string
const contra_ok: Contravar<'hi'> = (x: string) => {};

// Contravar<'hi'> is not assignable to Contravar<string>
const contra_bad: Contravar<string> = (x: 'hi') => {};

//---------- Invariance ----------//
type Invar<T> = (x: T) => T;

// Invar<'hi'> is assignable to Bivar<string>
const bi_ok: Invar<string> = (x: string) => x;

// Invar<string> is not assignable to Bivar<'hi'>
const bi_bad1: Invar<'hi'> = (x: string) => x;

// Invar<'hi'> is not assignable to Bivar<string>
const bi_bad2: Invar<string> = (x: 'hi') => x;