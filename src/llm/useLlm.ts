import React from 'react';

import { Context, context } from './llmContext.ts';

const useLlm = (): Context => React.useContext(context);

export default useLlm;
