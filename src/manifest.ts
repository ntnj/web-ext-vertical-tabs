export function getManifest(browser: string): string {
    const isFirefox = browser === 'firefox';
    let manifest = {
        name: 'Vertical Tabs',
        version: '0.0.1',
        icons: {
            128: 'icons/icon128.png',
        },
        manifest_version: 3,
        permissions: [
            'tabs',
            'contextMenus',
            ...isFirefox ?
                ['menus.overrideContext'] :
                ['sidePanel'],
        ],
        sidebar_action: isFirefox ? {
            default_icon: 'icons/icon128.png',
            default_title: 'Vertical Tabs',
            default_panel: 'sidebar.html',
            open_at_install: true,
        } : undefined,
        side_panel: !isFirefox ? {
            default_path: 'sidebar.html',
        } : undefined,
        background: {
            scripts: isFirefox ? ['background.js'] : undefined,
            service_worker: !isFirefox ? 'background.js' : undefined,
        },
        browser_specific_settings: isFirefox ? {
            gecko: {
                id: 'vertical-tabs@nitinja.in',
            },
        } : undefined,
    };

    return JSON.stringify(manifest, null, 2);
}