import JuBiterConnect from '../index';

export const cipherKeyValue = async () => {
    const kv = await JuBiterConnect.cipherKeyValue({
        path: 'm/44',
        key: 'key',
        value: 'hash',
        askOnEncrypt: true,
        askOnDecrypt: false,
        iv: 'advanced',
    });
    if (kv.success) {
        kv.payload.value;
    }

    // bundle
    const bundleKV = await JuBiterConnect.cipherKeyValue({
        bundle: [{ path: 'm/44', key: 'key', value: 'hash' }],
    });

    if (bundleKV.success) {
        bundleKV.payload.forEach(item => {
            item.value;
        });
        // @ts-ignore
        bundleKV.payload.xpub;
    } else {
        bundleKV.payload.error;
    }
};

export const customMessage = () => {
    JuBiterConnect.customMessage({
        messages: {},
        message: 'MyCustomSignTx',
        params: {
            inputs: { index: 1, hash: '0' },
        },
        callback: (request: any) => {
            if (request.type === 'MyCustomTxReq') {
                return Promise.resolve({
                    message: 'MyCustomTxAck',
                    params: {
                        index: 1,
                    },
                });
            }
            return Promise.resolve({ message: 'MyCustomSigned' });
        },
    });
};

// Method with mixed params
export const requestLogin = async () => {
    // async call
    const a = await JuBiterConnect.requestLogin({
        callback: () => ({
            challengeHidden: 'a',
            challengeVisual: 'b',
        }),
    });
    // const { success, payload } = a;
    // if (success && payload.address) {
    //     payload.address;
    // }
    // (payload: { error: string });

    if (a.success) {
        a.payload.address;
        a.payload.publicKey;
        a.payload.signature;
        // @ts-ignore
        a.payload.error;
    } else {
        a.payload.error;
        // @ts-ignore
        a.payload.address;
    }
    // sync call
    JuBiterConnect.requestLogin({
        challengeHidden: 'a',
        challengeVisual: 'b',
    });

    // @ts-ignore
    JuBiterConnect.requestLogin();
    // @ts-ignore
    JuBiterConnect.requestLogin({ callback: 'string' });
    // @ts-ignore
    JuBiterConnect.requestLogin({ challengeHidden: 'a' });
    // @ts-ignore
    JuBiterConnect.requestLogin({ challengeVisual: 1 });
};
