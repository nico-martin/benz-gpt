const nl2br = (str: string, is_xhtml: boolean = false): string => {
  if (typeof str === 'undefined' || str === null) {
    return '';
  }
  const breakTag =
    is_xhtml || typeof is_xhtml === 'undefined' ? '<br />' : '<br>';
  return (str + '').replace(
    /([^>\r\n]?)(\r\n|\n\r|\r|\n)/g,
    '$1' + breakTag + '$2'
  );
};

export default nl2br;
