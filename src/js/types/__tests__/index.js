/* @flow */
// JuBiterConnect API types tests

// Exported constants
/* eslint-disable no-unused-vars */
import JuBiterConnect, {
    UI_EVENT,
    DEVICE_EVENT,
    RESPONSE_EVENT,
    TRANSPORT_EVENT,
    BLOCKCHAIN_EVENT,
    BLOCKCHAIN,
    DEVICE,
    ERRORS,
    IFRAME,
    POPUP,
    TRANSPORT,
    UI,
} from '../../index';
/* eslint-disable no-unused-vars */

// Exported types
import type {
    API,
    Device,
    DeviceStatus,
    FirmwareRelease,
    DeviceFirmwareStatus,
    DeviceMode,
    Features,
    AccountInfo,
    EthereumAddress,
} from '../../index';

export const init = async () => {
    const manifest = { appUrl: '', email: '' };
    JuBiterConnect.init({ manifest });
    // $FlowIssue: invalid params
    JuBiterConnect.init();
    // $FlowIssue: invalid params
    JuBiterConnect.init({});
    // $FlowIssue: invalid params
    JuBiterConnect.init({ manifest: { appUrl: '', email: '' }, connectSrc: undefined });

    JuBiterConnect.manifest(manifest);
    // $FlowIssue: invalid params
    JuBiterConnect.manifest({});
    // $FlowIssue: invalid params
    JuBiterConnect.manifest({ appUrl: 1 });
    // $FlowIssue: invalid params
    JuBiterConnect.manifest({ email: 1 });

    const settings = await JuBiterConnect.getSettings();
    if (settings.success) {
        const { payload } = settings;
        (payload.manifest: typeof manifest | null | void);
        (payload.connectSrc: string | void);
        (payload.debug: boolean | void);
        (payload.popup: boolean | void);
        (payload.lazyLoad: boolean | void);
        (payload.webusb: boolean | void);
        (payload.pendingTransportEvent: boolean | void);
        (payload.pendingTransportEvent: boolean | void);
    }

    JuBiterConnect.dispose();
    JuBiterConnect.cancel();
    JuBiterConnect.cancel('Interruption error');
    JuBiterConnect.renderWebUSBButton();
    JuBiterConnect.disableWebUSB();
};

export const events = () => {
    JuBiterConnect.on(DEVICE_EVENT, event => {
        const { payload } = event;
        (event.type:
            | 'device-connect'
            | 'device-connect_unacquired'
            | 'device-changed'
            | 'device-disconnect');
        (payload.path: string);
        (payload.type: 'acquired' | 'unacquired' | 'unreadable');
        if (payload.type === 'acquired') {
            (payload.mode: 'normal' | 'bootloader' | 'initialize' | 'seedless');
            (payload.firmware: 'valid' | 'outdated' | 'required' | 'unknown' | 'none');
            (payload.status: 'available' | 'occupied' | 'used');
            // features
            (payload.features.vendor: string | null);
            (payload.features.device_id: string | null);
            (payload.features.major_version: number | null);
            (payload.features.minor_version: number | null);
            (payload.features.patch_version: number | null);
            (payload.features.pin_protection: boolean | null);
            (payload.features.passphrase_protection: boolean | null);
            (payload.features.label: string | null);
            (payload.features.initialized: boolean | null);
            (payload.features.revision: string | null);
            (payload.features.needs_backup: boolean | null);
            (payload.features.flags: number | null);
            (payload.features.unfinished_backup: boolean | null);
            (payload.features.no_backup: boolean | null);
            (payload.features.model: string);
            // error does not exist
            (payload.error: typeof undefined);
        }

        if (payload.type === 'unreadable') {
            // error field is accessible only in unreadable device
            payload.error.toLowerCase();
        }
    });
    JuBiterConnect.off(DEVICE_EVENT, () => {});
    // $FlowIssue: invalid event type
    JuBiterConnect.off('DEVICE---EVENT', () => {});

    JuBiterConnect.on(TRANSPORT_EVENT, event => {
        if (event.type === TRANSPORT.START) {
            event.payload.type;
            event.payload.version;
            event.payload.outdated;
        }
        if (event.type === TRANSPORT.ERROR) {
            event.payload.bridge;
        }
    });
    JuBiterConnect.off(TRANSPORT_EVENT, () => {});

    JuBiterConnect.on(UI_EVENT, event => {
        if (event.type === UI.BUNDLE_PROGRESS) {
            event.payload.progress;
            event.payload.error;
            event.payload.response;
        }
        if (event.type === UI.REQUEST_BUTTON) {
            event.payload.code;
            event.payload.data;
            event.payload.device;
        }
        if (event.type === UI.REQUEST_PIN) {
            event.payload.type;
            event.payload.device;
        }
        if (event.type === UI.INVALID_PIN) {
            (event.payload.type: void);
            event.payload.device;
        }
        if (event.type === UI.REQUEST_WORD) {
            event.payload.type;
            event.payload.device;
        }
    });
    JuBiterConnect.off(UI_EVENT, () => {});

    JuBiterConnect.on<AccountInfo>(UI.BUNDLE_PROGRESS, event => {
        event.progress;
        event.error;
        event.response.empty;
        event.response.availableBalance;
    });

    JuBiterConnect.on<EthereumAddress>(UI.BUNDLE_PROGRESS, event => {
        event.progress;
        event.error;
        event.response.serializedPath;
        event.response.address;
    });

    JuBiterConnect.on(UI.REQUEST_BUTTON, event => {
        event.code;
        event.data;
        event.device;
    });

    JuBiterConnect.on(BLOCKCHAIN_EVENT, event => {
        if (event.type === BLOCKCHAIN.CONNECT) {
            event.payload.blockHash;
            event.payload.shortcut;
            event.payload.testnet;
        }
        if (event.type === BLOCKCHAIN.BLOCK) {
            event.payload.blockHash;
            event.payload.blockHeight;
        }
        if (event.type === BLOCKCHAIN.NOTIFICATION) {
            event.payload.notification.descriptor;
            event.payload.notification.tx;
        }
    });
    JuBiterConnect.off(BLOCKCHAIN_EVENT, () => {});
};
