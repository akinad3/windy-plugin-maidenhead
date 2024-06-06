import type { ExternalPluginConfig } from '@windy/interfaces.d';

const config: ExternalPluginConfig = {
    name: 'windy-plugin-maidenhead-locator',
    icon: '🌧️',
    version: '0.0.1',

    title: 'Maidenhead Locator Plugin',

    description: 'This plugin calculates the maidenhead locator of the clicked point.',
    author: 'Daniel Lingvay',
    repository: 'https://github.com/windycom/windy-plugin-template',

    desktopUI: 'rhpane',
    mobileUI: 'small',

    addToContextmenu: true,

    routerPath: '/maidenhead-locator/:lat?/:lon?',

    listenToSingleclick: true,
};

export default config;
