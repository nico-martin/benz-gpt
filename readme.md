![BenzGPT](https://uploads.nico.dev/benz-gpt/logo.png)

# BenzGPT
BenzGPT is am AI Agent that uses the [PromptAPI](https://github.com/explainers-by-googlers/prompt-api) to understand a given command and then decide what it should do next. Should it just chat? Or should it move?

More than that it also uses the [WebSpeechAPI](https://developer.mozilla.org/en-US/docs/Web/API/Web_Speech_API) to transcribe spoken words into text and then uses the [SpeechSynthesisAPI](https://developer.mozilla.org/en-US/docs/Web/API/SpeechSynthesis) to speak back to the user. So you can actually talk to BenzGPT!

To round it all off, of course, it's not just a virtual conversation. A toy car can also be controlled via [WebBluetooth](https://developer.mozilla.org/en-US/docs/Web/API/Web_Bluetooth_API).

## Function calling
The core of BenzGPT is the [FunctionCallingPromptAPI](https://github.com/nico-martin/benz-gpt/blob/main/src/functionCallingPromptAPI/FunctionCallingPromptAPI.ts). It is an abstraction layer to convert any LLM (in this case the [PromptAPI](https://github.com/explainers-by-googlers/prompt-api)) into a function calling API.

```typescript
const benzGPT = new FunctionCallingPromptAPI();

// register a function
benzGPT.registerFunction<number>({
  name: 'move',
  description: 'Sets the new speed of the car',
  parameter: {
    name: 'speed',
    description:
      'can be a number between -100 (full speed backwards), 0 (stand still) and 100 (full speed)',
    type: 'number',
  },
  returnType: 'void',
  examples: [
    {
      message: 'I am moving forward with full speed, speed is set to 100%',
      function: 'move',
      parameter: 100,
    },
    {
      message: 'I did low down a bit. My new speed is 50%',
      function: 'move',
      parameter: 50,
    },
    {
      message:
        'I am moving backward with full speed, speed is set to -100%',
      function: 'move',
      parameter: -100,
    },
  ],
  run: runMove,
});

// initialize the session
await benzGPT.initializeSession(
  callback,
  'You are an intelligent car named "BenzGPT"'
);

// generate a response
const response = await benzGPT.generateResponse('I would like you to go full speed');
```
### Response
The response will then always be an object with the following structure:
```typescript
{
  content: string;
  role: 'system' | 'user' | 'assistant';
  error?: string;
  parsed: {
    message: string;
    function: string;
    parameter: string | number;
    functionResult?: any;
  }
}
```
If a function should be called, the `function` and `parameter` will be set. If the function was called successfully, the `functionResult` will be set.

### `registerFunction`
`registerFunction` is a method that accepts a function definition in a structured way and then generates a system prompt for the LLM that can then allow the LLM to use this function.