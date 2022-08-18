// @flow

import JuBiterConnect from '../../src/js/index';

// error thrown by .init()
const INIT_ERROR = { code: 'Init_ManifestMissing' };

describe('JuBiterConnect.init', () => {
    afterEach(() => {
        JuBiterConnect.dispose();
    });

    it('calling method before .init() and/or .manifest()', async () => {
        const { payload } = await JuBiterConnect.getCoinInfo({ coin: 'btc' });
        expect(payload).toMatchObject(INIT_ERROR);
    });

    it('missing manifest in JuBiterConnect.init', async () => {
        try {
            // $FlowExpectedError
            await JuBiterConnect.init();
            throw new Error('Should not be resolved');
        } catch (error) {
            expect(error).toMatchObject(INIT_ERROR);
        }
    });

    it('invalid manifest in JuBiterConnect.init', async () => {
        try {
            // $FlowExpectedError
            await JuBiterConnect.init({ manifest: {} });
            throw new Error('Should not be resolved');
        } catch (error) {
            expect(error).toMatchObject(INIT_ERROR);
        }
    });

    it('calling .init() multiple times', async () => {
        await JuBiterConnect.init({
            manifest: { appUrl: 'a', email: 'b' },
        });

        try {
            await JuBiterConnect.init({ manifest: { appUrl: 'a', email: 'b' } });
            throw new Error('Should not be resolved');
        } catch (error) {
            expect(error).toMatchObject({ code: 'Init_AlreadyInitialized' });
        }
    });

    it('init success', async () => {
        await JuBiterConnect.init({ manifest: { appUrl: 'a', email: 'b' } });

        const resp = await JuBiterConnect.getCoinInfo({ coin: 'btc' });
        expect(resp).toMatchObject({
            payload: { type: 'bitcoin', shortcut: 'BTC' },
        });
    });

    it('manifest success', async () => {
        JuBiterConnect.manifest({
            appUrl: 'a',
            email: 'b',
        });
        const resp = await JuBiterConnect.getCoinInfo({ coin: 'btc' });
        expect(resp).toMatchObject({
            payload: { type: 'bitcoin', shortcut: 'BTC' },
        });
    });
});
