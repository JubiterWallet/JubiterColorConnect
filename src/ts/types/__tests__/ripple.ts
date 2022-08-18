import JuBiterConnect from '../index';

export const rippleGetAddress = async () => {
    // regular
    const singleAddress = await JuBiterConnect.rippleGetAddress({ path: 'm/44' });

    if (singleAddress.success) {
        const { payload } = singleAddress;
        payload.address;
        payload.path;
        payload.serializedPath;
        // @ts-ignore
        payload.forEach(item => {
            item.address;
        });
    }

    // bundle
    const bundleAddress = await JuBiterConnect.rippleGetAddress({ bundle: [{ path: 'm/44' }] });

    if (bundleAddress.success) {
        bundleAddress.payload.forEach(item => {
            item.address;
            item.path;
            item.serializedPath;
        });
        // @ts-ignore
        bundleAddress.payload.address;
    } else {
        bundleAddress.payload.error;
    }

    // with all possible params
    JuBiterConnect.rippleGetAddress({
        device: {
            path: '1',
            instance: 1,
            state: 'state@device-id:1',
        },
        useEmptyPassphrase: true,
        allowSeedlessDevice: false,
        keepSession: false,
        skipFinalReload: false,
        path: 'm/44',
        address: 'a',
        showOnTrezor: true,
    });

    // with invalid params
    // @ts-ignore
    JuBiterConnect.rippleGetAddress();
    // @ts-ignore
    JuBiterConnect.rippleGetAddress({ coin: 'btc' });
    // @ts-ignore
    JuBiterConnect.rippleGetAddress({ path: 1 });
    // @ts-ignore
    JuBiterConnect.rippleGetAddress({ bundle: 1 });
};

export const rippleSignTransaction = async () => {
    const sign = await JuBiterConnect.rippleSignTransaction({
        path: 'm/44',
        transaction: {
            payment: {
                amount: '100',
                destination: '1',
                destinationTag: 1,
            },
            fee: '1',
            flags: 1,
            sequence: 1,
            maxLedgerVersion: 1,
        },
    });

    if (sign.success) {
        const { payload } = sign;
        payload.serializedTx;
        payload.signature;
    }
};
