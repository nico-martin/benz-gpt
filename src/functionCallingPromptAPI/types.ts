export type CompletionMessage = {
  content: string;
  role: 'system' | 'user' | 'assistant';
  error?: string;
};

export interface Message extends CompletionMessage {
  parsed?: OutputMessage;
}

export interface OutputMessage<> {
  message: string;
  function: string;
  parameter: string | number;
  functionResult?: any;
}

type TypeToString<T> = T extends number
  ? 'number'
  : T extends string
    ? 'string'
    : T extends boolean
      ? 'boolean'
      : 'unknown';

export interface Parameter<T> {
  name: string;
  description: string;
  type: TypeToString<T>;
}

export interface Function<P = any, R = any> {
  name: string;
  description: string;
  parameter: Parameter<P>;
  returnType: string | number;
  examples: Array<OutputMessage>;
  run: (parameter: P) => R;
}
