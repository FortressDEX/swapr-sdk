"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getProvider = exports.RPC_PROVIDER_LIST = void 0;
const providers_1 = require("@ethersproject/providers");
const constants_1 = require("../../../../constants");
exports.RPC_PROVIDER_LIST = {
    [constants_1.ChainId.MAINNET]: 'https://mainnet.infura.io/v3/e1a3bfc40093494ca4f36b286ab36f2d',
    [constants_1.ChainId.XDAI]: 'https://rpc.xdaichain.com/',
    [constants_1.ChainId.ARBITRUM_ONE]: 'https://arb1.arbitrum.io/rpc',
};
/**
 *  Construct a new read-only Provider
 */
const getProvider = (chainId) => {
    const host = exports.RPC_PROVIDER_LIST[chainId];
    return new providers_1.JsonRpcProvider(host);
};
exports.getProvider = getProvider;
//# sourceMappingURL=utils.js.map