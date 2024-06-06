export const splitText = (text: string) => {
  const regex = new RegExp(/<[^>]*>/);
  const word = text.split(/(<[^>]*>)/gi);
  const ary: string[] = [];

  word.forEach((text) => {
    if (!regex.test(text)) {
      text.split('').forEach((t) => {
        t = t === ' ' ? '&nbsp;' : t;
        ary.push(`<span>${t}</span>`);
      });
    } else {
      ary.push(text);
    }
  });

  const rtn = ary.join('');

  return rtn;
};
