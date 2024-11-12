export type CompletionMessage = {
  content: string;
  role: 'system' | 'user' | 'assistant';
};

export interface Message extends CompletionMessage {
  parsed?: OutputMessage;
}

export interface OutputMessage {
  message: string;
  function: string;
  parameter: string | number;
}

export interface Parameter {
  name: string;
  type: 'string' | 'number';
  description: string;
}

export interface Function {
  name: string;
  description: string;
  parameter: Parameter;
  returnType: string | number;
  examples: Array<OutputMessage>;
}
