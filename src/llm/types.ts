export type CompletionMessage = {
  content: string;
  role: 'system' | 'user' | 'assistant';
};

export interface Message extends CompletionMessage {
  parsed?: {
    message: string;
    function: string;
    parameter: number;
  };
}
