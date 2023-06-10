import { MouseEvent } from 'react';

const isLocal = import.meta.env.DEV;
const isFirefox = import.meta.env.MODE === "firefox";

export async function getTabs(): Promise<chrome.tabs.Tab[]> {
    if (isLocal) {
        return testTabs;
    }
    if (isFirefox) {
        return browser.tabs.query({
            windowId: chrome.windows.WINDOW_ID_CURRENT,
        }) as Promise<chrome.tabs.Tab[]>;
    }
    return chrome.tabs.query({
        windowId: chrome.windows.WINDOW_ID_CURRENT,
    });
}

export async function activateTab(tabId: number): Promise<chrome.tabs.Tab> {
    if (isLocal) {
        testTabs.forEach((tab) => {
            tab.active = tab.id == tabId;
        });
        emitLocalTabChange();
        return;
    }
    return chrome.tabs.update(tabId, {
        active: true,
    });
}

export async function deleteTab(e: MouseEvent, tabId: number): Promise<void> {
    e.stopPropagation();
    if (isLocal) {
        testTabs = testTabs.filter(tab => tab.id !== tabId);
        emitLocalTabChange();
        return;
    }
    return chrome.tabs.remove(tabId);
}

export function contextMenu(e: MouseEvent, tabId: number): void {
    if (isLocal) {
        e.preventDefault();
        return;
    }
    if (isFirefox) {
        browser.contextMenus.overrideContext({
            context: "tab",
            tabId: tabId,
        });
    }
}

export function registerCallbacks(callback: () => void): () => void {
    if (isLocal) {
        document.addEventListener("localtabchange", callback);
        return () => document.removeEventListener("localtabchange", callback);
    }
    const events = [
        chrome.tabs.onUpdated,
        chrome.tabs.onActivated,
        chrome.tabs.onCreated,
        chrome.tabs.onRemoved,
        chrome.tabs.onMoved,
        chrome.tabs.onAttached,
    ]
    events.forEach(e => e.addListener(callback));
    return () => events.forEach(e => e.removeListener(callback));
}

function emitLocalTabChange(): void {
    document.dispatchEvent(new Event("localtabchange"));
}

let testTabs: chrome.tabs.Tab[] = [
    {
        id: 1,
        title: "Tab 1",
        active: true,
    },
    {
        id: 2,
        title: "Tab 2",
        active: false,
    },
    {
        id: 3,
        title: "Tab with very very very very very very very very very very very very very long title",
        active: false,
    },
] as chrome.tabs.Tab[];
