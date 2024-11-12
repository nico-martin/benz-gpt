import { Function } from './types.ts';
import { CompletionMessage, Message } from '../llm/types.ts';

class FunctionCallingPromptAPI extends EventTarget {
  private session: any;
  private _messages: Array<Message> = [];
  private functions: Array<Function> = [];
  private _busy: boolean;
  private initialized: boolean = false;

  constructor() {
    super();
  }

  set messages(messages: Array<Message>) {
    this._messages = messages;
    this.dispatchEvent(
      new CustomEvent<Array<CompletionMessage>>('messagesChanged', {
        detail: messages,
      })
    );
  }

  get messages() {
    return this._messages;
  }

  public onMessagesChanged = (
    callback: (messages: Array<CompletionMessage>) => void
  ) => {
    const listener = () => callback(this.messages);
    this.addEventListener('messagesChanged', listener);
    return () => this.removeEventListener('messagesChanged', listener);
  };

  set busy(busy: boolean) {
    this._busy = busy;
    this.dispatchEvent(
      new CustomEvent<boolean>('busyChanged', { detail: busy })
    );
  }

  get busy() {
    return this._busy;
  }

  public onbusyChanged = (callback: (busy: boolean) => void) => {
    const listener = () => callback(this.busy);
    this.addEventListener('busyChanged', listener);
    return () => this.removeEventListener('busyChanged', listener);
  };

  public addFunction = (func: Function): void => {
    if (this.initialized) {
      throw new Error('Cannot add functions after session is initialized');
    }
    this.functions.push(func);
  };

  public initializeSession = async (
    callback: any = () => {},
    systemMessage: string = ''
  ): Promise<void> => {
    const systemPrompt = `${systemMessage}
You are friendly and helpful and you always answer in the following, valid JSON format:

{
  "message": string // describe what you are doing next
  "function": string // one of the functions above
  "parameter": string | number // the parameter used for the function
}

FUNCTIONS:
${this.functions
  .map((func) => {
    return `function: ${func.name}
description: ${func.description}
parameter: ${func.parameter.name} // ${func.parameter.type} - ${func.parameter.description}
`;
  })
  .join('\n\n')}

EXAMPLES:
these are just examples. Choose the paramaters that you thik are best for the situation.
${this.functions
  .map((func) =>
    func.examples
      .map((example) => {
        return `{
  "message": "${example.message}",  
  "function": "${example.function}",  
  "parameter": ${func.parameter.type === 'string' ? '"' + example.parameter + '"' : '"' + example.parameter + '"'},  
}

`;
      })
      .join('\n')
  )
  .join('\n')}
{
  "message": "I am just chatting",
  "function": null,
  "parameter": null
}
    `;
    this.session = await ai.languageModel.create({
      systemPrompt,
    });
    console.log(systemPrompt);

    this.messages = [
      ...this.messages,
      { role: 'system', content: systemPrompt },
    ];

    this.initialized = true;
    callback('created');
  };

  private parseMessage = (message: CompletionMessage): Message => {
    const json = JSON.parse(message.content);
    const parsed = {
      message: json.message || null,
      function: json.function || null,
      parameter: json.parameter || json.parameter === 0 ? json.parameter : null,
    };

    return {
      ...message,
      parsed,
    };
  };

  public generate = async (text: string): Promise<Message> => {
    this.busy = true;
    this.messages = [...this.messages, { role: 'user', content: text }];
    console.log('Generating', text);
    const answer = await this.session.prompt(text);
    console.log('Answer', answer);

    try {
      const parsed = this.parseMessage({ role: 'assistant', content: answer });
      this.messages = [...this.messages, parsed];
      this.busy = false;
      return parsed;
    } catch (e) {
      console.error(e);
      throw new Error('Error parsing message', e);
    }
  };
}

export default FunctionCallingPromptAPI;
