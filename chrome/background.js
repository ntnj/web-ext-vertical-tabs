chrome.runtime.onInstalled.addListener(() => {
  {
    chrome.sidePanel.setPanelBehavior({ openPanelOnActionClick: true });
  }
});
chrome.contextMenus.onClicked.addListener((e, tab) => {
  switch (e.menuItemId) {
    case "new-tab":
      chrome.tabs.create({
        index: tab.index + 1,
        openerTabId: tab.id
      });
      return;
    case "reload-tab":
      chrome.tabs.reload(tab.id);
      return;
    case "close-tab":
      chrome.tabs.remove(tab.id);
      return;
  }
});
