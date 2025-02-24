/* @flow */

import { UiMessage } from '../../message/builder';
import * as UI from '../../constants/ui';
import DataManager from '../../data/DataManager';
import { container, showView, postMessage, createTooltip } from './common';
import type { RequestPermission } from '../../types/events';

const getPermissionText = (permissionType: string, _deviceName: string) => {
    switch (permissionType) {
        case 'read':
            return 'Read public keys from JuBiter device';
        case 'read-meta':
            return 'Read metadata from JuBiter device';
        case 'write':
            return 'Prepare JuBiter device for transaction and data signing';
        case 'write-meta':
            return 'Write metadata to JuBiter device';
        case 'management':
            return 'Modify device settings';
        case 'custom-message':
            return 'Run custom operations';
        default:
            return '';
    }
};

const getPermissionTooltipText = (permissionType: string) => {
    switch (permissionType) {
        case 'read':
            return 'Permission needed to load public information from your device.';
        case 'write':
            return 'Permission needed to execute operations, such as composing a transaction, after your confirmation.';
        case 'management':
            return 'Permission needed to change device settings, such as PIN, passphrase, label or seed.';
        case 'custom-message':
            return 'Development tool. Use at your own risk. Allows service to send arbitrary data to your JuBiter device.';
        default:
            return '';
    }
};

const createPermissionItem = (permissionText: string, tooltipText: string) => {
    const permissionItem = document.createElement('div');
    permissionItem.className = 'permission-item';

    // Tooltip
    if (tooltipText !== '') {
        const tooltip = createTooltip(tooltipText);
        permissionItem.appendChild(tooltip);
    }
    //

    // Permission content (icon & text)
    const contentDiv = document.createElement('div');
    contentDiv.className = 'content';
    const infoIcon = document.createElement('span');
    infoIcon.className = 'info-icon';

    const permissionTextSpan = document.createElement('span');
    permissionTextSpan.innerText = permissionText;
    contentDiv.appendChild(infoIcon);
    contentDiv.appendChild(permissionTextSpan);
    permissionItem.appendChild(contentDiv);
    //

    return permissionItem;
};

export const initPermissionsView = (payload: $PropertyType<RequestPermission, 'payload'>) => {
    showView('permissions');

    const h3 = container.getElementsByTagName('h3')[0];
    const hostName = h3.getElementsByClassName('host-name')[0];
    const permissionsList = container.getElementsByClassName('permissions-list')[0];
    const confirmButton = container.getElementsByClassName('confirm')[0];
    const cancelButton = container.getElementsByClassName('cancel')[0];
    const rememberCheckbox: HTMLInputElement = (container.getElementsByClassName(
        'remember-permissions',
    )[0]: any);

    hostName.innerText = DataManager.getSettings('hostLabel') || DataManager.getSettings('origin');
    if (payload && Array.isArray(payload.permissions)) {
        payload.permissions.forEach(p => {
            const permissionText = getPermissionText(p, payload.device.label);
            const tooltipText = getPermissionTooltipText(p);

            const permissionItem = createPermissionItem(permissionText, tooltipText);
            permissionsList.appendChild(permissionItem);
        });
    }

    confirmButton.onclick = () => {
        postMessage(
            UiMessage(UI.RECEIVE_PERMISSION, {
                remember: rememberCheckbox && rememberCheckbox.checked,
                granted: true,
            }),
        );
        showView('loader');
    };

    cancelButton.onclick = () => {
        postMessage(
            UiMessage(UI.RECEIVE_PERMISSION, {
                remember: rememberCheckbox && rememberCheckbox.checked,
                granted: false,
            }),
        );
        showView('loader');
    };

    rememberCheckbox.onchange = e => {
        confirmButton.innerText = e.target.checked
            ? 'Always allow for this service'
            : 'Allow once for this session';
    };
};
