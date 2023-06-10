import React, { startTransition, useEffect, useState } from 'react';
import { getTabs, activateTab, deleteTab, contextMenu, registerCallbacks } from './browser.ts';

export default function Tabs() {
  const [tabs, setTabs] = useState<chrome.tabs.Tab[]>([]);

  useEffect(() => {
    const callback = () => {
      async function update() {
        const tabs = await getTabs();
        if (tabs) {
          startTransition(() => {
            setTabs(tabs);
          });
        }
      }
      update();
    };
    callback();
    return registerCallbacks(callback);
  }, []);

  let tree = [];
  return (
    <div className='flex flex-col flex-nowrap max-w-full overflow-x-hidden'>
      {(
        tabs.map(tab => {
          tree.splice(tree.indexOf(tab.openerTabId) + 1);
          tree.push(tab.id);
          return <Tab key={tab.id} tab={tab} level={tree.length - 1} />;
        })
      )}
    </div>
  );
}

function Tab({ tab, level }: { tab: chrome.tabs.Tab, level: number }) {
  return (
    <div title={`${tab.title}\n${tab.url}`} onClick={() => activateTab(tab.id)} onContextMenu={(e) => { contextMenu(e, tab.id) }}
      className={`relative truncate group select-none h-8 my-1 py-1 px-1 rounded-sm ${tab.active ? 'shadow-blue-500 shadow-[0_0_4px_1px]' : 'hover:bg-[#eee]'}`}>
      {level > 0 && <span translate='no'>{'\u00A0'.repeat(level * 2 - 2)}{'\u221F '}</span>}
      {tab.favIconUrl && <img src={tab.favIconUrl} className='inline-block h-6 mr-1 aspect-square rounded-none align-middle' />}
      <span translate='no'>{tab.title}</span>
      <div onClick={e => deleteTab(e, tab.id)}
        className='invisible absolute top-1/2 -translate-y-1/2 right-0 bg-[#eee]/50 group-hover:visible aspect-square mx-2 px-2 hover:bg-[#ddd]'>{'\u00d7'}</div>
    </div>
  );
}