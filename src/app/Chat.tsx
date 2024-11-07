import React from 'react';
import cn from '@utils/classnames.ts';
import styles from './Chat.module.css';
import useLlm from '../llm/useLlm.ts';
import showdown from 'showdown';
import nl2br from '@utils/nl2br.ts';

const showdownConverter = new showdown.Converter();

const Chat: React.FC<{ className?: string }> = ({ className = '' }) => {
  const { messages } = useLlm();

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
                  ? `<pre>${message.parsed.function}(${message.parsed?.parameter || message.parsed?.parameter === 0 ? message.parsed?.parameter : ''})</pre>`
                  : ''),
            }}
          />
        ))}
    </ul>
  );
};

export default Chat;
