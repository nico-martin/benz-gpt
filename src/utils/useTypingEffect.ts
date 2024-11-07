import React from 'react';

interface Element {
  text: string;
  Element?: React.ElementType;
  props?: Record<string, string | number>;
}

interface ExtendedElement extends Element {
  startIndex: number;
  endIndex: number;
}

const useTypingEffect = (
  elements: Array<{
    text: string;
    Element?: React.ElementType;
    props?: Record<string, string | number>;
    pauseAfter?: number;
  }>,
  speed: number = 2000,
  callback: () => void = () => {}
) => {
  const [displayedElements, setDisplayedElements] = React.useState<
    Array<React.JSX.Element>
  >([]);

  React.useEffect(() => {
    let index = 0;
    const allTextLength = elements.reduce(
      (acc, element) => acc + element.text.length + (element.pauseAfter || 0),
      0
    );

    const augmentedElements: Array<ExtendedElement> = elements.reduce(
      (acc: Array<ExtendedElement>, element, i) => {
        const prev = acc[i - 1];
        const startIndex = prev ? prev?.endIndex + 1 : 0;
        const endIndex =
          startIndex + element.text.length + (element.pauseAfter || 0) - 1;

        return [
          ...acc,
          {
            ...element,
            startIndex,
            endIndex,
          },
        ];
      },
      []
    );

    const intervalId = setInterval(() => {
      setDisplayedElements(
        augmentedElements.map(
          ({ text, Element = React.Fragment, props, startIndex = {} }) => {
            const relativeIndex = index - Number(startIndex);
            return React.createElement(
              Element,
              props,
              relativeIndex >= 0 ? text.slice(0, relativeIndex + 1) : ''
            );
          }
        )
      );
      index += 1;
      if (index === allTextLength) {
        callback();
        clearInterval(intervalId);
      }
    }, speed / allTextLength);

    return () => clearInterval(intervalId); // Clean up on unmount
  }, []);

  return displayedElements;
};

export default useTypingEffect;
