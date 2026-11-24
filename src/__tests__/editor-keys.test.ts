import { EditorState } from '@codemirror/state';
import { formatRelativeLineNumber } from '../renderer/utils/editor-config';
import {
  expandLeader,
  keyMatchesToken,
  tokenizeKeys,
} from '../renderer/utils/vim-keys';

describe('vim key helpers', () => {
  it('expands the leader', () => {
    expect(expandLeader('<leader>e', '<Space>')).toBe('<Space>e');
    expect(expandLeader('<leader>>', ',')).toBe(',>');
    expect(expandLeader('L', ',')).toBe('L');
  });

  it('tokenizes key sequences', () => {
    expect(tokenizeKeys('<Space>p')).toEqual(['<Space>', 'p']);
    expect(tokenizeKeys(',<')).toEqual([',', '<']);
    expect(tokenizeKeys('<C-w>j')).toEqual(['<C-w>', 'j']);
  });

  it('matches keyboard events against tokens', () => {
    const event = (key: string, mods = {}) => ({
      key,
      ctrlKey: false,
      altKey: false,
      metaKey: false,
      shiftKey: false,
      ...mods,
    });

    expect(keyMatchesToken('<Space>', event(' '))).toBe(true);
    expect(keyMatchesToken('p', event('p'))).toBe(true);
    expect(keyMatchesToken('p', event('P'))).toBe(false);
    expect(keyMatchesToken('p', event('p', { metaKey: true }))).toBe(false);
    expect(keyMatchesToken('<C-l>', event('l', { ctrlKey: true }))).toBe(true);
    expect(keyMatchesToken('<C-l>', event('l'))).toBe(false);
    expect(keyMatchesToken('<Esc>', event('Escape'))).toBe(true);
  });
});

describe('relative line numbers', () => {
  const state = EditorState.create({
    doc: 'a\nb\nc\nd\ne',
    selection: { anchor: 4 }, // line 3
  });

  it('shows the distance to the cursor line and the absolute number on it', () => {
    expect(
      [1, 2, 3, 4, 5].map((n) => formatRelativeLineNumber(n, state)),
    ).toEqual(['2', '1', '3', '1', '2']);
  });
});
