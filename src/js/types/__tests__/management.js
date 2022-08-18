/* @flow */
import JuBiterConnect from '../../index';

export const management = () => {
    JuBiterConnect.resetDevice({
        strength: 1,
        label: 'My Trezor',
        u2f_counter: 0,
        pin_protection: true,
        passphrase_protection: true,
        skip_backup: false,
        no_backup: false,
        backup_type: 0,
    });

    JuBiterConnect.wipeDevice({});

    JuBiterConnect.applyFlags({
        flags: 1,
    });

    JuBiterConnect.applySettings({
        homescreen: 'string',
        display_rotation: 180,
        use_passphrase: true,
        label: 'My Trezor',
    });

    JuBiterConnect.backupDevice({});

    JuBiterConnect.changePin({
        remove: true,
    });

    JuBiterConnect.firmwareUpdate({
        binary: new ArrayBuffer(0),
    });

    JuBiterConnect.firmwareUpdate({
        version: [2, 2, 0],
        btcOnly: false,
    });

    // $FlowExpectedError: cannot use both
    JuBiterConnect.firmwareUpdate({
        binary: new ArrayBuffer(0),
        version: [2, 2, 0],
    });

    JuBiterConnect.recoveryDevice({
        passphrase_protection: true,
        pin_protection: true,
        label: 'My Trezor',
        type: 1,
        dry_run: true,
        word_count: 24,
    });
};
