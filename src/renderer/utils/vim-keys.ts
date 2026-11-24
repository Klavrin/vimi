/** Replaces `<leader>` in a vim key sequence with the configured leader key. */
export const expandLeader = (keys: string, leader: string) =>
  keys.replace(/<leader>/gi, leader);

/** Splits a vim key sequence like `<Space>e` into its keys: `['<Space>', 'e']`. */
export const tokenizeKeys = (keys: string): string[] =>
  keys.match(/<[^<>\s]+>|./gu) ?? [];

/** Whether a keyboard event is the key described by a single vim key token. */
export const keyMatchesToken = (
  token: string,
  e: Pick<KeyboardEvent, 'key' | 'ctrlKey' | 'altKey' | 'metaKey' | 'shiftKey'>,
) => {
  if (token.length === 1) {
    return e.key === token && !e.ctrlKey && !e.metaKey && !e.altKey;
  }

  const inner = token.slice(1, -1);
  const lower = inner.toLowerCase();

  switch (lower) {
    case 'space':
      return e.key === ' ';
    case 'cr':
    case 'enter':
    case 'return':
      return e.key === 'Enter';
    case 'esc':
      return e.key === 'Escape';
    case 'tab':
      return e.key === 'Tab';
    case 'bs':
      return e.key === 'Backspace';
    case 'lt':
      return e.key === '<';
    default:
      break;
  }

  const modified = /^([cam])-(.+)$/i.exec(inner);
  if (modified) {
    const [, modifier, key] = modified;
    const m = modifier.toLowerCase();
    return (
      e.key.toLowerCase() === key.toLowerCase() &&
      e.ctrlKey === (m === 'c') &&
      e.altKey === (m === 'a') &&
      e.metaKey === (m === 'm')
    );
  }

  return false;
};
