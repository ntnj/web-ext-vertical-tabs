import { r as reactDomExports, a as reactExports, R as React } from "./assets/react-95468aaa.js";
(function polyfill() {
  const relList = document.createElement("link").relList;
  if (relList && relList.supports && relList.supports("modulepreload")) {
    return;
  }
  for (const link of document.querySelectorAll('link[rel="modulepreload"]')) {
    processPreload(link);
  }
  new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      if (mutation.type !== "childList") {
        continue;
      }
      for (const node of mutation.addedNodes) {
        if (node.tagName === "LINK" && node.rel === "modulepreload")
          processPreload(node);
      }
    }
  }).observe(document, { childList: true, subtree: true });
  function getFetchOpts(link) {
    const fetchOpts = {};
    if (link.integrity)
      fetchOpts.integrity = link.integrity;
    if (link.referrerPolicy)
      fetchOpts.referrerPolicy = link.referrerPolicy;
    if (link.crossOrigin === "use-credentials")
      fetchOpts.credentials = "include";
    else if (link.crossOrigin === "anonymous")
      fetchOpts.credentials = "omit";
    else
      fetchOpts.credentials = "same-origin";
    return fetchOpts;
  }
  function processPreload(link) {
    if (link.ep)
      return;
    link.ep = true;
    const fetchOpts = getFetchOpts(link);
    fetch(link.href, fetchOpts);
  }
})();
const index = "";
var client = {};
var m = reactDomExports;
{
  client.createRoot = m.createRoot;
  client.hydrateRoot = m.hydrateRoot;
}
async function getTabs() {
  {
    return browser.tabs.query({
      windowId: chrome.windows.WINDOW_ID_CURRENT
    });
  }
}
async function activateTab(tabId) {
  return chrome.tabs.update(tabId, {
    active: true
  });
}
async function deleteTab(e, tabId) {
  e.stopPropagation();
  return chrome.tabs.remove(tabId);
}
function contextMenu(e, tabId) {
  {
    browser.contextMenus.overrideContext({
      context: "tab",
      tabId
    });
  }
}
function registerCallbacks(callback) {
  const events = [
    chrome.tabs.onUpdated,
    chrome.tabs.onActivated,
    chrome.tabs.onCreated,
    chrome.tabs.onRemoved,
    chrome.tabs.onMoved,
    chrome.tabs.onAttached
  ];
  events.forEach((e) => e.addListener(callback));
  return () => events.forEach((e) => e.removeListener(callback));
}
function Tabs() {
  const [tabs, setTabs] = reactExports.useState([]);
  reactExports.useEffect(() => {
    const callback = () => {
      async function update() {
        const tabs2 = await getTabs();
        if (tabs2) {
          reactExports.startTransition(() => {
            setTabs(tabs2);
          });
        }
      }
      update();
    };
    callback();
    return registerCallbacks(callback);
  }, []);
  let tree = [];
  return /* @__PURE__ */ React.createElement("div", { className: "flex flex-col flex-nowrap max-w-full overflow-x-hidden" }, tabs.map((tab) => {
    tree.splice(tree.indexOf(tab.openerTabId) + 1);
    tree.push(tab.id);
    return /* @__PURE__ */ React.createElement(Tab, { key: tab.id, tab, level: tree.length - 1 });
  }));
}
function Tab({ tab, level }) {
  return /* @__PURE__ */ React.createElement(
    "div",
    {
      title: `${tab.title}
${tab.url}`,
      onClick: () => activateTab(tab.id),
      onContextMenu: (e) => {
        contextMenu(e, tab.id);
      },
      className: `relative truncate group select-none h-8 my-1 py-1 px-1 rounded-sm ${tab.active ? "shadow-blue-500 shadow-[0_0_4px_1px]" : "hover:bg-[#eee]"}`
    },
    level > 0 && /* @__PURE__ */ React.createElement("span", { translate: "no" }, " ".repeat(level * 2 - 2), "∟ "),
    tab.favIconUrl && /* @__PURE__ */ React.createElement("img", { src: tab.favIconUrl, className: "inline-block h-6 mr-1 aspect-square rounded-none align-middle" }),
    /* @__PURE__ */ React.createElement("span", { translate: "no" }, tab.title),
    /* @__PURE__ */ React.createElement(
      "div",
      {
        onClick: (e) => deleteTab(e, tab.id),
        className: "invisible absolute top-1/2 -translate-y-1/2 right-0 bg-[#eee]/50 group-hover:visible aspect-square mx-2 px-2 hover:bg-[#ddd]"
      },
      "×"
    )
  );
}
client.createRoot(document.getElementById("root")).render(
  /* @__PURE__ */ React.createElement(React.StrictMode, null, /* @__PURE__ */ React.createElement(Tabs, null))
);
