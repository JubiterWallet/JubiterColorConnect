/**
When the button's clicked:
- call for JuBiterConnect action
- show a notification with response (if succeed)
*/

const JuBiterConnect  = window.JuBiterConnect;

JuBiterConnect.manifest({
    email: 'email@developer.com',
    appUrl: 'webextension-app-boilerplate',
});

function onClick() {
    JuBiterConnect.getAddress({
        path: "m/49'/0'/0'/0/0",
    })
        .then(response => {
            const message = response.success
                ? `BTC Address: ${response.payload.address}`
                : `Error: ${response.payload.error}`;
            chrome.notifications.create(new Date().getTime().toString(), {
                type: 'basic',
                iconUrl: 'icons/48.png',
                title: 'JuBiterConnect',
                message,
            });
        })
        .catch(error => {
            console.error('JuBiterConnectError', error);
        });
}
chrome.browserAction.onClicked.addListener(onClick);
