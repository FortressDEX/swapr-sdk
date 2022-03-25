"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.KpiToken = void 0;
const tslib_1 = require("tslib");
const decimal_js_light_1 = tslib_1.__importDefault(require("decimal.js-light"));
const tiny_invariant_1 = tslib_1.__importDefault(require("tiny-invariant"));
const ethers_1 = require("ethers");
const priced_token_1 = require("./priced-token");
const token_1 = require("../entities/token");
const fractions_1 = require("../entities/fractions");
const currency_1 = require("../entities/currency");
class KpiToken extends priced_token_1.PricedToken {
    constructor(chainId, address, totalSupply, collateral, kpiId, symbol, name) {
        const collateralTokenNativeCurrency = collateral.nativeCurrencyAmount;
        const kpiTokenPrice = new decimal_js_light_1.default(collateralTokenNativeCurrency.raw.toString()).dividedBy(totalSupply.toString());
        const nativeCurrency = currency_1.Currency.getNative(chainId);
        const token = new token_1.Token(chainId, address, 18, symbol, name);
        super(chainId, address, 18, new fractions_1.Price({
            baseCurrency: token,
            quoteCurrency: nativeCurrency,
            denominator: ethers_1.utils.parseUnits('1', nativeCurrency.decimals).toString(),
            numerator: ethers_1.utils.parseUnits(kpiTokenPrice.toFixed(nativeCurrency.decimals), nativeCurrency.decimals).toString()
        }), symbol, name); // decimals are always 18 for kpi tokens
        (0, tiny_invariant_1.default)(collateral.token.chainId === chainId, 'inconsistent chain id in collateral');
        this.totalSupply = new fractions_1.TokenAmount(this, totalSupply);
        this.collateral = collateral;
        this.kpiId = kpiId;
    }
}
exports.KpiToken = KpiToken;
//# sourceMappingURL=kpi-token.js.map