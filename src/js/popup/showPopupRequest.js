/* @flow */

const LAYER_ID = 'JubiterConnectInteractionLayer';
const HTML = `
    <div class="trezorconnect-container" id="${LAYER_ID}">
        <div class="trezorconnect-window">
            <div class="trezorconnect-head">
                <svg xmlns="http://www.w3.org/2000/svg" width="95" height="24" viewBox="0 0 95 24">
                    <image id="背景" width="95" height="24" xlink:href="data:img/png;base64,iVBORw0KGgoAAAANSUhEUgAAAF8AAAAYCAYAAACcESEhAAAAUElEQVRoge3QQRHAMADDsHX8Oacw9KiFwOezbV+IXwe8rPlQ86HmQ82Hmg81H2o+1Hyo+VDzoeZDzYeaDzUfaj7UfKj5UPOh5kPNh5oPNR+6zKEELAOB3XYAAAAASUVORK5CYII="/>
                    <image id="矢量智能对象" y="1" width="95" height="23" xlink:href="data:img/png;base64,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"/>
                </svg>
                <div class="trezorconnect-close">
                    <svg x="0px" y="0px" viewBox="24 24 60 60" width="24px" height="24px" preserveAspectRatio="xMinYMin meet">
                        <polygon class="st0" points="40,67.9 42.1,70 55,57.1 67.9,70 70,67.9 57.1,55 70,42.1 67.9,40 55,52.9 42.1,40 40,42.1 52.9,55 "/>
                    </svg>
                </div>
            </div>
            <div class="trezorconnect-body">
                <h3>Popup was blocked</h3>
                <p>Please click to “Continue” to open popup manually</p>
                <button class="trezorconnect-open">Continue</button>
            </div>
        </div>
    </div>
`;

export const showPopupRequest = (open: () => void, cancel: () => void) => {
    if (document.getElementById(LAYER_ID)) {
        return;
    }

    const div = document.createElement('div');
    div.id = LAYER_ID;
    div.className = 'trezorconnect-container';
    div.innerHTML = HTML;

    if (document.body) {
        document.body.appendChild(div);
    }

    const button = div.getElementsByClassName('trezorconnect-open')[0];
    button.onclick = () => {
        open();
        if (document.body) {
            document.body.removeChild(div);
        }
    };

    const close = div.getElementsByClassName('trezorconnect-close')[0];
    close.onclick = () => {
        cancel();
        if (document.body) {
            document.body.removeChild(div);
        }
    };
};
