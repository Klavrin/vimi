import { toggleSidebar } from './sidebar/toggle-sidebar';
import { setSidebarValue } from './sidebar/set-sidebar-value';
import { setNewDirectoryPath } from './directory/set-new-directory-path';
import { setActiveTabIndex } from './tabs/set-active-tab-index';
import { incrementActiveTabIndex } from './tabs/increment-active-tab-index';
import { decrementActiveTabIndex } from './tabs/decrement-active-tab-index';
import { removeTab } from './tabs/remove-tab';
import { removeCurrentTab } from './tabs/remove-current-tab';

export default {
  sidebar: {
    setSidebarValue,
    toggleSidebar,
  },
  directory: {
    setNewDirectoryPath,
  },
  tabs: {
    setActiveTabIndex,
    incrementActiveTabIndex,
    decrementActiveTabIndex,
    removeTab,
    removeCurrentTab,
  },
};
