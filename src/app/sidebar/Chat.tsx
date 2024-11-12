import React from 'react';
import cn from '@utils/classnames.ts';
import styles from './Chat.module.css';
import showdown from 'showdown';
import nl2br from '@utils/nl2br.ts';
import { Message } from '../../functionCallingPromptAPI/types.ts';

const showdownConverter = new showdown.Converter();

const Chat: React.FC<{ className?: string; messages: Array<Message> }> = ({
  className = '',
  messages,
}) => {
  return (
    <ul className={cn(className, styles.list)}>
      {messages
        .filter(
          (message) => message.role === 'user' || message.role === 'assistant'
        )
        .reverse()
        .map((message, i) => (
          <li
            key={i}
            className={cn(styles.item, {
              [styles.itemUser]: message.role === 'user',
            })}
            dangerouslySetInnerHTML={{
              __html:
                showdownConverter.makeHtml(
                  nl2br(message?.parsed?.message || message.content)
                ) +
                (message?.parsed?.function
                  ? `<pre>Function: ${message.parsed.function}(${message.parsed?.parameter || message.parsed?.parameter === 0 ? message.parsed?.parameter : ''})</pre>`
                  : '') +
                (message?.error
                  ? `<pre class="${styles.preError}">${message.error})</pre>`
                  : ''),
            }}
          />
        ))}
    </ul>
  );
};

export default Chat;
