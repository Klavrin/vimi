# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

Vimi is a macOS-first Markdown note-taking app with vim keymaps, built on electron-react-boilerplate (Electron + React 18 + Redux Toolkit + styled-components + CodeMirror 6 with `@replit/codemirror-vim`). Notes are plain `.md` files in a user-chosen folder.

## Commands

```bash
npm start                      # dev: webpack-dev-server for the renderer; it spawns the main process (electronmon) itself
npm run build                  # production build of main + renderer
npm run package                # build and package with electron-builder
npm run lint                   # eslint over the whole repo (many pre-existing errors; lint touched files with `npx eslint <files>`)
npx tsc --noEmit               # type check
npm test                       # jest (jsdom, ts-jest)
npx jest src/__tests__/tab-bar.test.ts        # single test file
npx jest -t "reorder"                          # tests matching a name
```

Known baseline failures (not caused by your change): `tsc` reports a `Sidebar.tsx` vs `sidebar.tsx` casing clash (TS1261) and a type error in `sidebar.tsx`; `src/__tests__/App.test.tsx` fails because jest can't parse the ESM `unified` package. Jest's `setupFiles` runs `.erb/scripts/check-build-exists.ts`, which requires `npm run build:main` and `npm run build:renderer` to have been run once.

## Architecture

**Two processes talking over IPC.** `src/main/main.ts` owns all filesystem/native work (`fs-extra`, `shell.trashItem`, `dialog`), with menu items in `src/main/menu.ts` and dialogs in `src/main/utils/open-dialogs.ts`. The renderer never touches the filesystem: it calls `window.electron.ipcRenderer.sendMessage(channel, payload)` and listens with `.on(channel, cb)` (bridge in `src/main/preload.ts`). Every new channel must be added to the `Channels` union in `preload.ts`. The pattern is request/reply pairs (`readFile` → `fileContents`, `writeFile` → `fileSaved`/`fileSaveError`, `confirmUnsavedClose` → `confirmUnsavedCloseReply`). Menu shortcuts are implemented by the main process sending a channel to the renderer (`closeCurrentTab`, `saveCurrentFile`, `closeFolder`). Main-process handlers reply with an error channel instead of throwing.

**Renderer state (`src/renderer/store/reducers/`).** Redux Toolkit slices:
- `current-directory`: the session folder. It is persisted in `localStorage`, and an empty string means "no folder", which shows the intro page.
- `tab-bar`: open tabs and the active index. Each tab has `contents`/`savedContents` (dirty = they differ) and `order`, and the slice persists tabs to IndexedDB itself.
- `workspace`: file tree, `isEditing`, editor refs, settings visibility.
- `sidebar-active`: whether the sidebar is shown.
- `theme`: the current theme, persisted in localStorage.
- `settings`: editor/autosave/vim settings, persisted as JSON in `localStorage['settings']` and merged over defaults.

IPC listeners that must exist once for the app lifetime (`closeCurrentTab`, `saveCurrentFile`, `closeFolder`) live in `components/workspace-tab-header.tsx` and read current state via `store.getState()` to avoid stale closures. The `fileContents` → `addTab` listener lives in `components/Main.tsx`, which is always mounted.

**Persistence.** `src/renderer/utils/db.ts` wraps IndexedDB (`active-tabs` store keyed by `_id`). It uses one cached connection and resolves on transaction `oncomplete`, and `updateTabs` batches writes. Don't reintroduce shared mutable `IDBRequest` variables: that caused an `InvalidStateError` race when reordering tabs.

**Save/close flows.** `src/renderer/utils/save-tab.ts` (`saveTab`, `closeTab`) and `utils/close-folder.ts` hold the logic for saving, closing dirty tabs (native Save / Don't Save / Cancel) and closing the folder back to the intro page. Reuse these instead of dispatching `removeTab` directly.

**Editor and vim.**
- `utils/use-codemirror.ts` creates one CodeMirror view per tab, once. Live settings changes (vim on/off, line wrap, line numbers, font size) are applied through CodeMirror `Compartment`s, never by recreating the view.
- `utils/use-vim-config.ts` registers app-level vim actions and ex commands through the global `Vim` API: leader mappings, next/prev tab, toggle preview, move tab, `:w`/`:wq`/`:q`. These come from `settings.vim`, and the previous mappings are unmapped before remapping.
- `utils/vim-keys.ts` and `utils/editor-config.ts` hold the key and settings helpers.
- Editors are keyed by tab `_id`, not index, so tabs can be reordered without remounting. This includes `markdownEditorRefs` and `workspace.editorRefs`.

**Keyboard focus model.** Outside the editor, vim-style navigation is plain `keydown` listeners: the sidebar uses `j`/`k`/`a`/`d`/`r`/`D` and `Ctrl+l`, and the intro page uses `j`/`k`/Enter. They are gated by `state.workspace.isEditing`. Anything that takes text input outside CodeMirror (command menu `Cmd+K`, settings inputs) sets `isEditing` so those handlers stay quiet.

**UI.**
- Pages: `pages/main-page` holds the sidebar, tab header, workspace or intro page, and the settings modal.
- Styles: styled-components in `components/styles/*`, reading tokens from the theme objects in `styles/themes/{dark,light,gruvbox,midnight-blue}.ts` (`theme.text.*`, `theme.background.*`, `theme.border.*`). Use `text.primary`, with opacity or `color-mix`, for muted text. `text.secondary` is too light in the light theme and is also used as a hover background.
- Animations: framer-motion, including `Reorder` for dragging tabs.
- Preview: unified, remark and rehype-highlight.

**Graph.** `graphify-out/` (untracked, don't commit it; may be absent) holds a graphify knowledge graph of the codebase. When it exists, `graphify query "<question>"` is a fast way to locate code.

## Default vim keymaps

- `<leader>e`: open/focus sidebar
- `<leader>p`: toggle preview
- `Ctrl+l`: focus editor from sidebar
- `H`/`L`: previous/next tab
- in the sidebar: `a` create file, `d` delete, `r` rename, `D` create directory

The leader defaults to Space and can be changed in Settings.
