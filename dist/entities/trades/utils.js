"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getProvider = exports.RPC_PROVIDER_LIST = exports.tryGetChainId = exports.wrappedCurrency = exports.wrappedAmount = void 0;
const tslib_1 = require("tslib");
const providers_1 = require("@ethersproject/providers");
const tiny_invariant_1 = tslib_1.__importDefault(require("tiny-invariant"));
const tokenAmount_1 = require("../fractions/tokenAmount");
const constants_1 = require("../../constants");
const currency_1 = require("../currency");
const token_1 = require("../token");
function wrappedAmount(currencyAmount, chainId) {
    if (currencyAmount instanceof tokenAmount_1.TokenAmount)
        return currencyAmount;
    if (currency_1.Currency.isNative(currencyAmount.currency))
        return new tokenAmount_1.TokenAmount(token_1.Token.getNativeWrapper(chainId), currencyAmount.raw);
    (0, tiny_invariant_1.default)(false, 'CURRENCY');
}
exports.wrappedAmount = wrappedAmount;
function wrappedCurrency(currency, chainId) {
    if (currency instanceof token_1.Token)
        return currency;
    if (currency_1.Currency.isNative(currency))
        return token_1.Token.getNativeWrapper(chainId);
    (0, tiny_invariant_1.default)(false, 'CURRENCY');
}
exports.wrappedCurrency = wrappedCurrency;
function tryGetChainId(currencyAmount, currency) {
    return currencyAmount instanceof tokenAmount_1.TokenAmount
        ? currencyAmount.token.chainId
        : currency instanceof token_1.Token
            ? currency.chainId
            : undefined;
}
exports.tryGetChainId = tryGetChainId;
/**
 *
 */
exports.RPC_PROVIDER_LIST = {
    [constants_1.ChainId.MAINNET]: 'https://mainnet.infura.io/v3/e1a3bfc40093494ca4f36b286ab36f2d',
    [constants_1.ChainId.XDAI]: 'https://rpc.xdaichain.com/',
    [constants_1.ChainId.RINKEBY]: 'https://rinkeby.infura.io/v3/e1a3bfc40093494ca4f36b286ab36f2d',
    [constants_1.ChainId.ARBITRUM_ONE]: 'https://arb1.arbitrum.io/rpc',
    [constants_1.ChainId.ARBITRUM_RINKEBY]: 'https://rinkeby.arbitrum.io/rpc',
};
/**
 * Returns a RPC provider for the given chainId.
 * @param chainId The chainId
 * @returns The RPC provider
 */
function getProvider(chainId) {
    const host = exports.RPC_PROVIDER_LIST[chainId];
    return new providers_1.JsonRpcProvider(host);
}
exports.getProvider = getProvider;
//# sourceMappingURL=utils.js.map