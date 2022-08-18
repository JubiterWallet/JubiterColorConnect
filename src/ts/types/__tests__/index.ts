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
    IFRAME,
    POPUP,
    TRANSPORT,
    UI,
    // Exported types
    Device,
    DeviceStatus,
    FirmwareRelease,
    DeviceFirmwareStatus,
    DeviceMode,
    Features,
    AccountInfo,
    EthereumAddress,
} from '../index';
/* eslint-disable no-unused-vars */

export const init = async () => {
    const manifest = { appUrl: '', email: '' };
    JuBiterConnect.init({ manifest });
    // @ts-ignore
    JuBiterConnect.init();
    // @ts-ignore
    JuBiterConnect.init({});
    // @ts-ignore
    JuBiterConnect.manifest({});
    // @ts-ignore
    JuBiterConnect.manifest({ appUrl: 1 });
    // @ts-ignore
    JuBiterConnect.manifest({ email: 1 });

    const settings = await JuBiterConnect.getSettings();
    if (settings.success) {
        const { payload } = settings;
        payload.manifest;
        payload.connectSrc;
        payload.debug;
        payload.popup;
        payload.lazyLoad;
        payload.webusb;
        payload.pendingTransportEvent;
        payload.pendingTransportEvent;
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
        event.type;
        payload.path;
        payload.type;
        if (payload.type === 'acquired') {
            payload.mode;
            payload.firmware;
            payload.status;

            // features
            payload.features.vendor;
            payload.features.device_id;
            payload.features.major_version;
            payload.features.minor_version;
            payload.features.patch_version;
            payload.features.pin_protection;
            payload.features.passphrase_protection;
            payload.features.label;
            payload.features.initialized;
            payload.features.revision;
            payload.features.needs_backup;
            payload.features.flags;
            payload.features.unfinished_backup;
            payload.features.no_backup;
            payload.features.model;
            // @ts-expect-error: error does not exist
            payload.error.toLowerCase();
        }

        if (payload.type === 'unreadable') {
            // error field is accessible only in unreadable device
            payload.error.toLowerCase();
        }
    });
    JuBiterConnect.off(DEVICE_EVENT, () => {});
    JuBiterConnect.removeAllListeners();

    // @ts-ignore
    JuBiterConnect.on('DEVICE-EVENT', () => {});

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
            event.payload.code === 'ButtonRequest_ConfirmOutput';
            event.payload.code === 'ButtonRequest_FirmwareUpdate';
            // @ts-expect-error
            event.payload.code === 'foo';
            event.payload.data;
            event.payload.device;
        }

        if (event.type === UI.REQUEST_PIN) {
            event.payload.type === 'PinMatrixRequestType_Current';
            // @ts-expect-error
            event.payload.type === 'foo';
        }

        if (event.type === UI.REQUEST_WORD) {
            event.payload.type === 'WordRequestType_Plain';
            // @ts-expect-error
            event.payload.type === 'foo';
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
