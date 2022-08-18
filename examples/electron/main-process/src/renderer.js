// print log helper
const printLog = data => {
    const log = document.getElementById('log');
    const current = log.value;
    if (current.length > 0) {
        log.value = `${JSON.stringify(data)}\n\n${current}`;
    } else {
        log.value = JSON.stringify(data);
    }
};

// click to get public key
const btn = document.getElementById('get-xpub');
btn.onclick = () => {
    // send request to jubiter-connect
    window.ipcRenderer.send('jubiter-connect', {
        method: 'getPublicKey',
        params: {
            path: "m/49'/0'/0'",
            coin: 'btc',
        },
    });
};

// receive data from JuBiterConnect
window.ipcRenderer.on('jubiter-connect', (event, message) => {
    printLog(message);
});

// initJuBiterConnect in electron main process
window.ipcRenderer.send('jubiter-connect', 'init');
