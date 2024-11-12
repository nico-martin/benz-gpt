import { Function, CompletionMessage, Message } from './types.ts';

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

  public registerFunction = <P = string>(func: Function<P>): void => {
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

    this.messages = [
      ...this.messages,
      { role: 'system', content: systemPrompt },
    ];

    this.initialized = true;
    callback('created');
  };

  private parseMessage = (message: CompletionMessage): Message => {
    const json = JSON.parse(message.content.replace(/,\s*([}\]])/g, '$1'));
    const parsed = {
      message: json.message || null,
      function: json.function || null,
      parameter: json.parameter || json.parameter === 0 ? json.parameter : null,
    };

    const func = this.functions.find((f) => f.name === parsed.function);
    if (func) {
      if (func.parameter.type === 'number') {
        parsed.parameter = Number(parsed.parameter);
      }
    } else {
      parsed.function = null;
      parsed.parameter = null;
    }

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
    console.log('Raw Answer', answer);

    try {
      const parsed = this.parseMessage({ role: 'assistant', content: answer });
      console.log('Parsed', parsed);
      if (parsed.parsed.function) {
        const func = this.functions.find(
          (f) => f.name === parsed.parsed.function
        );
        if (func) {
          parsed.parsed.functionResult = func.run(parsed.parsed.parameter);
        }
      }
      console.log('Final Parsed', parsed);
      this.messages = [...this.messages, parsed];
      this.busy = false;
      return parsed;
    } catch (e) {
      this.messages = [
        ...this.messages,
        {
          role: 'assistant',
          content: 'I am sorry, I could not understand that.',
          error: e.toString(),
        },
      ];
      this.busy = false;
      console.error(e);
      throw new Error('Error parsing message', e);
    }
  };
}

export default FunctionCallingPromptAPI;
