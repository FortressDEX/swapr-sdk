"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.tryGetChainId = exports.wrappedCurrency = exports.wrappedAmount = void 0;
const tslib_1 = require("tslib");
const tiny_invariant_1 = tslib_1.__importDefault(require("tiny-invariant"));
const tokenAmount_1 = require("../fractions/tokenAmount");
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
//# sourceMappingURL=utils.js.map