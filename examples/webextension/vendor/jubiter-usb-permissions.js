// const VERSION = '8.1.25';
// const versionN = VERSION.split('.').map(s => parseInt(s, 10));
// const DIRECTORY = `${versionN[0]}/`;
// const url = `https://connect.trezor.io/${DIRECTORY}`;
const url = `https://localhost:8088/`;
/* Handling messages from usb permissions iframe */
function switchToPopupTab(event) {
    window.removeEventListener('beforeunload', switchToPopupTab);

    if (!event) {
        // triggered from 'usb-permissions-close' message
        // close current tab
        chrome.tabs.query(
            {
                currentWindow: true,
                active: true,
            },
            current => {
                if (current.length < 0) return;
                chrome.tabs.remove(current[0].id);
            },
        );
    }

    // find tab by popup pattern and switch to it
    chrome.tabs.query(
        {
            url: `${url}popup.html`,
        },
        tabs => {
            if (tabs.length < 0) return;
            chrome.tabs.update(tabs[0].id, { active: true });
        },
    );
}

window.addEventListener('message', event => {
    if (event.data === 'jubiter-usb-permissions-init') {
        const iframe = document.getElementById('jubiter-usb-permissions');
        if (!iframe || !(iframe instanceof HTMLIFrameElement)) {
            throw new Error('jubiter-usb-permissions missing or incorrect dom type');
        }
        iframe.contentWindow.postMessage(
            {
                type: 'jubiter-usb-permissions-init',
                extension: chrome.runtime.id,
            },
            '*',
        );
    } else if (event.data === 'jubiter-usb-permissions-close') {
        switchToPopupTab();
    }
});

window.addEventListener('beforeunload', switchToPopupTab);
window.addEventListener('load', () => {
    const instance = document.createElement('iframe');
    instance.id = 'jubiter-usb-permissions';
    instance.frameBorder = '0';
    instance.width = '100%';
    instance.height = '100%';
    instance.style.border = '0px';
    instance.style.width = '100%';
    instance.style.height = '100%';
    instance.setAttribute('src', `${url}extension-permissions.html`);
    instance.setAttribute('allow', 'usb');

    if (document.body) {
        document.body.appendChild(instance);
    }
});
