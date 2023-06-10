const menuItems: Record<string, void> = {

}

const isFirefox = import.meta.env.MODE === "firefox";

chrome.runtime.onInstalled.addListener(() => {
    const menus: [string, string][] = [
        ['new-tab', "New Tab"],
        ['separator-0', ''],
        ['reload-tab', 'Reload Tab'],
        ['close-tab', 'Close Tab'],
    ];
    menus.forEach(m => {
        if (isFirefox) {
            browser.contextMenus.create({
                contexts: ['tab'],
                viewTypes: ['sidebar'],
                type: m[1] === '' ? 'separator' : 'normal',
                id: m[0],
                title: m[1],
                documentUrlPatterns: [`moz-extension://${location.host}/*`],
            });
        }
    });
    if (!isFirefox) {
        chrome.sidePanel.setPanelBehavior({ openPanelOnActionClick: true });
    }
});

chrome.contextMenus.onClicked.addListener((e, tab) => {
    switch (e.menuItemId) {
        case 'new-tab':
            chrome.tabs.create({
                index: tab.index + 1,
                openerTabId: tab.id,
            });
            return;
        case 'reload-tab':
            chrome.tabs.reload(tab.id);
            return;
        case 'close-tab':
            chrome.tabs.remove(tab.id);
            return;
    }
});