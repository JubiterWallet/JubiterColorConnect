/* @flow */
import JuBiterConnect from '../../index';

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
        (kv.payload.value: string);
    }

    // bundle
    const bundleKV = await JuBiterConnect.cipherKeyValue({
        bundle: [{ path: 'm/44', key: 'key', value: 'hash' }],
    });
    (bundleKV.success: boolean);
    if (bundleKV.success) {
        bundleKV.payload.forEach(item => {
            (item.value: string);
        });
    } else {
        (bundleKV.payload.error: string);
    }

    // $FlowExpectedError: payload is Address
    const e1 = await JuBiterConnect.cipherKeyValue({ bundle: [{ path: 'm/44', key: 'key' }] });
    if (e1.success) e1.payload.xpub;
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
    (a.success: boolean);
    if (a.success) {
        (a.payload.address: string);
        (a.payload.publicKey: string);
        (a.payload.signature: string);
    } else {
        (a.payload.error: string);
    }
    // sync call
    JuBiterConnect.requestLogin({
        challengeHidden: 'a',
        challengeVisual: 'b',
    });

    // $FlowExpectedError
    const e1 = await JuBiterConnect.requestLogin({
        challengeHidden: 'a',
        challengeVisual: 'b',
    });
    if (e1.success) {
        // error does not exists
        (e1.payload.error: string);
    } else {
        // address does not exists
        (e1.payload.address: string);
    }

    // $FlowExpectedError
    JuBiterConnect.requestLogin();
    // $FlowExpectedError
    JuBiterConnect.requestLogin({ callback: 'string' });
    // $FlowExpectedError
    JuBiterConnect.requestLogin({ challengeHidden: 'a' });
    // $FlowExpectedError
    JuBiterConnect.requestLogin({ challengeVisual: 1 });
};
