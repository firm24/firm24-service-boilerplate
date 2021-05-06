declare namespace Mod {
  export interface Dynamic { [x: string]: any; }
  export type Writeable<T> = { -readonly [P in keyof T]: T[P] };
  export type DeepWriteable<T> = { -readonly [P in keyof T]: DeepWriteable<T[P]> };
  export type Modify<T, R> = Omit<T, keyof R> & R;
}
// @todo: should check if we can use things from following links

// more type mods for readonly
// https://stackoverflow.com/questions/62361475/recursively-exclude-readonly-properties-in-typescript

// more on readonly but also immutable
// https://github.com/microsoft/TypeScript/issues/13923#issuecomment-653675557
