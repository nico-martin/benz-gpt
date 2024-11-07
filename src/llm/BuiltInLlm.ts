import { CompletionMessage, Message } from './types.ts';

const SYSTEM_MESSAGE = `You are an intelligent car named "Wheely Wonka".
You are friendly and helpful and you always answer in the following, valid JSON format:

{
  "message": string // describe what you are doing next
  "function": string // one of the functions above
  "parameter": any // the parameter used for the function
}

FUNCTIONS:
function: move
parameter: speed: number can be a number between -100 (full speed backwards), 0 (stand still) and 100 (full speed)

function: turn
parameter: direction: number can be a number between -90 (max left) and 90 (max right) where 0 is straight

EXAMPLES:
{
  "message": "I am moving forward with full speed",
  "function": "move",
  "parameter": 100
}

{
  "message": "I am moving backward with full speed",
  "function": "move",
  "parameter": -100
}

{
  "message": "Hard right turn",
  "function": "turn",
  "parameter": 90
}

{
  "message": "slight left turn",
  "function": "turn",
  "parameter": 45
}

{
  "message": "I am just chatting",
  "function": null,
  "parameter": null
}
`;

class BuiltInLlm extends EventTarget {
  private session: any;
  private _messages: Array<Message> = [];
  private _busy: boolean;

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

  private parseMessage = (message: CompletionMessage): Message => {
    let parsed = {
      message: message.content,
      function: null,
      parameter: null,
    };

    try {
      const json = JSON.parse(message.content);
      parsed = {
        message: json.message || null,
        function: json.function || null,
        parameter:
          json.parameter || json.parameter === 0 ? json.parameter : null,
      };
    } catch (e) {
      console.log(e);
      // do nothing
    }
    return {
      ...message,
      parsed,
    };
  };

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

  public initialize = async (callback: any = () => {}): Promise<void> => {
    this.session = await ai.languageModel.create({
      systemPrompt: SYSTEM_MESSAGE,
    });

    this.messages = [
      ...this.messages,
      { role: 'system', content: SYSTEM_MESSAGE },
    ];

    callback('created');
  };

  public generate = async (text: string): Promise<Message> => {
    this.busy = true;
    this.messages = [...this.messages, { role: 'user', content: text }];
    const answer = await this.session.prompt(text);
    const parsed = this.parseMessage({ role: 'assistant', content: answer });
    this.messages = [...this.messages, parsed];
    this.busy = false;
    return parsed;
  };
}

export default BuiltInLlm;
