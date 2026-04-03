/**
 * LumeBoard Extension - Background Service Worker (V3)
 */

chrome.commands.onCommand.addListener(async (command) => {
  if (command === 'quick-save') {
    const [tab] = await chrome.tabs.query({ active: true, lastFocusedWindow: true });
    if (!tab?.url || !tab?.title) return;

    try {
      const FOLDER_NAME = 'LumeBoard_Unsorted';
      chrome.bookmarks.search({ title: FOLDER_NAME }, (results) => {
        const folder = results.find(r => !r.url);
        
        const save = (parentId) => {
          chrome.bookmarks.create({ parentId, title: tab.title, url: tab.url }, () => {
            chrome.notifications.create({
              type: 'basic',
              iconUrl: 'assets/icon-128.png',
              title: 'Saved to LumeBoard!',
              message: `${tab.title} has been added to your dashboard.`
            });
          });
        };

        if (folder) {
          save(folder.id);
        } else {
          chrome.bookmarks.create({ title: FOLDER_NAME }, (f) => save(f.id));
        }
      });
    } catch (e) {
      console.error('Quick-save failed:', e);
    }
  }
});

chrome.runtime.onInstalled.addListener(() => {
  console.log('LumeBoard extension installed successfully.');
});
