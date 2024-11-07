import React from 'react';
import cn from '@utils/classnames.ts';
import styles from './Form.module.css';
import { Button } from '@theme';

const Form: React.FC<{
  className?: string;
  processRequest: (text: string) => void;
}> = ({ className = '', processRequest }) => {
  const textareaRef = React.useRef<HTMLTextAreaElement>(null);

  React.useEffect(() => {
    textareaRef?.current?.focus();
  }, [textareaRef]);

  return (
    <form
      className={cn(styles.root, className)}
      onSubmit={async (e) => {
        e.preventDefault();
        const textarea = document.querySelector<HTMLTextAreaElement>(
          'textarea[name=test]'
        );
        const text = textarea.value;
        await processRequest(text);
        textarea.focus();
        textarea.value = '';
      }}
    >
      <textarea name="test"></textarea>
      <Button type="submit">ask</Button>
    </form>
  );
};

export default Form;
