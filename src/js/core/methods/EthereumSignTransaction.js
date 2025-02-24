/* @flow */

import AbstractMethod from './AbstractMethod';
import { validateParams, getFirmwareRange } from './helpers/paramsValidator';
import { validatePath } from '../../utils/pathUtils';
import { getEthereumNetwork } from '../../data/CoinInfo';
import { getNetworkLabel } from '../../utils/ethereumUtils';
import { stripHexPrefix } from '../../utils/formatUtils';
import * as helper from './helpers/ethereumSignTx';
import type {
    EthereumTransaction,
    EthereumTransactionEIP1559,
} from '../../types/networks/ethereum';

type Params = {
    path: number[],
    tx:
        | ({ type: 'legacy' } & EthereumTransaction)
        | ({ type: 'eip1559' } & EthereumTransactionEIP1559),
};

// const strip: <T>(value: T) => T = value => {
const strip: (value: any) => any = value => {
    if (typeof value === 'string') {
        let stripped = stripHexPrefix(value);
        // pad left even
        if (stripped.length % 2 !== 0) {
            stripped = `0${stripped}`;
        }
        return stripped;
    }
    if (Array.isArray(value)) {
        return value.map(strip);
    }
    if (typeof value === 'object') {
        return Object.entries(value).reduce((acc, [k, v]) => ({ ...acc, [k]: strip(v) }), {});
    }
    return value;
};

export default class EthereumSignTx extends AbstractMethod<'ethereumSignTransaction'> {
    params: Params;

    init() {
        this.requiredPermissions = ['read', 'write'];

        const { payload } = this;

        // validate incoming parameters
        validateParams(payload, [
            { name: 'path', required: true },
            { name: 'transaction', required: true },
        ]);

        const path = validatePath(payload.path, 3);
        const network = getEthereumNetwork(path);

        this.info = getNetworkLabel('Sign #NETWORK transaction', network);

        // incoming transaction should be in EthereumTx format
        // https://github.com/ethereumjs/ethereumjs-tx
        const tx = payload.transaction;
        const isEIP1559 = tx.maxFeePerGas && tx.maxPriorityFeePerGas;

        // get firmware range depending on used transaction type
        // eip1559 is possible since 2.4.2
        this.firmwareRange = getFirmwareRange(
            isEIP1559 ? 'eip1559' : this.name,
            network,
            this.firmwareRange,
        );

        const schema = isEIP1559
            ? [
                  { name: 'to', type: 'string', required: true },
                  { name: 'value', type: 'string', required: true },
                  { name: 'gasLimit', type: 'string', required: true },
                  { name: 'maxFeePerGas', type: 'string', required: true },
                  { name: 'maxPriorityFeePerGas', type: 'string', required: true },
                  { name: 'nonce', type: 'string', required: true },
                  { name: 'data', type: 'string' },
                  { name: 'chainId', type: 'number', required: true },
              ]
            : [
                  { name: 'to', type: 'string', required: true },
                  { name: 'value', type: 'string', required: true },
                  { name: 'gasLimit', type: 'string', required: true },
                  { name: 'gasPrice', type: 'string', required: true },
                  { name: 'nonce', type: 'string', required: true },
                  { name: 'data', type: 'string' },
                  { name: 'chainId', type: 'number' },
                  { name: 'txType', type: 'number' },
              ];

        validateParams(tx, schema);

        // Since FW 2.4.3+ chainId will be required
        // TODO: this should be removed after next major/minor version (or after few months)
        // TODO: add "required: true" to chainId validation
        if (typeof tx.chainId !== 'number') {
            // eslint-disable-next-line no-console
            console.warn('JuBiterConnect.ethereumSignTransaction: Missing chainId parameter!');
        }

        this.params = {
            path,
            tx: {
                type: isEIP1559 ? 'eip1559' : 'legacy',
                ...strip(tx), // strip '0x' from values
            },
        };
    }

    run() {
        const { tx } = this.params;
        return tx.type === 'eip1559'
            ? helper.ethereumSignTxEIP1559(
                  this.device.getCommands().typedCall.bind(this.device.getCommands()),
                  this.params.path,
                  tx.to,
                  tx.value,
                  tx.gasLimit,
                  tx.maxFeePerGas,
                  tx.maxPriorityFeePerGas,
                  tx.nonce,
                  tx.chainId,
                  tx.data,
                  tx.accessList,
              )
            : helper.ethereumSignTx(
                  this.device.getCommands().typedCall.bind(this.device.getCommands()),
                  this.params.path,
                  tx.to,
                  tx.value,
                  tx.gasLimit,
                  tx.gasPrice,
                  tx.nonce,
                  tx.chainId,
                  tx.data,
                  tx.txType,
              );
    }
}
