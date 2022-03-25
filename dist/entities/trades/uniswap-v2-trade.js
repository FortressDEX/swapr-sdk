"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UniswapV2Trade = exports.tradeComparator = exports.inputOutputComparator = void 0;
const tslib_1 = require("tslib");
const tiny_invariant_1 = tslib_1.__importDefault(require("tiny-invariant"));
const constants_1 = require("../../constants");
const utils_1 = require("../../utils");
const currency_1 = require("../currency");
const currencyAmount_1 = require("../fractions/currencyAmount");
const fraction_1 = require("../fractions/fraction");
const percent_1 = require("../fractions/percent");
const price_1 = require("../fractions/price");
const tokenAmount_1 = require("../fractions/tokenAmount");
const route_1 = require("../route");
const token_1 = require("../token");
const trade_1 = require("./interfaces/trade");
const router_json_1 = tslib_1.__importDefault(require("../../abis/router.json"));
const contracts_1 = require("@ethersproject/contracts");
const utils_2 = require("./utils");
function toHex(currencyAmount) {
    return `0x${currencyAmount.raw.toString(16)}`;
}
const ZERO_HEX = '0x0';
/**
 * Returns the percent difference between the mid price and the execution price, i.e. price impact.
 * @param midPrice mid price before the trade
 * @param inputAmount the input amount of the trade
 * @param outputAmount the output amount of the trade
 */
function computePriceImpact(midPrice, inputAmount, outputAmount) {
    const exactQuote = midPrice.raw.multiply(inputAmount.raw);
    // calculate slippage := (exactQuote - outputAmount) / exactQuote
    const slippage = exactQuote.subtract(outputAmount.raw).divide(exactQuote);
    return new percent_1.Percent(slippage.numerator, slippage.denominator);
}
// comparator function that allows sorting trades by their output amounts, in decreasing order, and then input amounts
// in increasing order. i.e. the best trades have the most outputs for the least inputs and are sorted first
function inputOutputComparator(a, b) {
    // must have same input and output token for comparison
    (0, tiny_invariant_1.default)((0, token_1.currencyEquals)(a.inputAmount.currency, b.inputAmount.currency), 'INPUT_CURRENCY');
    (0, tiny_invariant_1.default)((0, token_1.currencyEquals)(a.outputAmount.currency, b.outputAmount.currency), 'OUTPUT_CURRENCY');
    if (a.outputAmount.equalTo(b.outputAmount)) {
        if (a.inputAmount.equalTo(b.inputAmount)) {
            return 0;
        }
        // trade A requires less input than trade B, so A should come first
        if (a.inputAmount.lessThan(b.inputAmount)) {
            return -1;
        }
        else {
            return 1;
        }
    }
    else {
        // tradeA has less output than trade B, so should come second
        if (a.outputAmount.lessThan(b.outputAmount)) {
            return 1;
        }
        else {
            return -1;
        }
    }
}
exports.inputOutputComparator = inputOutputComparator;
// extension of the input output comparator that also considers other dimensions of the trade in ranking them
function tradeComparator(a, b) {
    const ioComp = inputOutputComparator(a, b);
    if (ioComp !== 0) {
        return ioComp;
    }
    // consider lowest slippage next, since these are less likely to fail
    if (a.priceImpact.lessThan(b.priceImpact)) {
        return -1;
    }
    else if (a.priceImpact.greaterThan(b.priceImpact)) {
        return 1;
    }
    // finally consider the number of hops since each hop costs gas
    return a.route.path.length - b.route.path.length;
}
exports.tradeComparator = tradeComparator;
/**
 * Represents a trade executed against a list of pairs.
 * Does not account for slippage, i.e. trades that front run this trade and move the price.
 */
class UniswapV2Trade extends trade_1.TradeWithSwapTransaction {
    constructor(route, amount, maximumSlippage, tradeType) {
        (0, tiny_invariant_1.default)(maximumSlippage.greaterThan('0'), 'MAXIMUM_SLIPPAGE');
        const amounts = new Array(route.path.length);
        const nextPairs = new Array(route.pairs.length);
        if (tradeType === constants_1.TradeType.EXACT_INPUT) {
            (0, tiny_invariant_1.default)((0, token_1.currencyEquals)(amount.currency, route.input), 'INPUT');
            amounts[0] = (0, utils_2.wrappedAmount)(amount, route.chainId);
            for (let i = 0; i < route.path.length - 1; i++) {
                const pair = route.pairs[i];
                const [outputAmount, nextPair] = pair.getOutputAmount(amounts[i]);
                amounts[i + 1] = outputAmount;
                nextPairs[i] = nextPair;
            }
        }
        else {
            (0, tiny_invariant_1.default)((0, token_1.currencyEquals)(amount.currency, route.output), 'OUTPUT');
            amounts[amounts.length - 1] = (0, utils_2.wrappedAmount)(amount, route.chainId);
            for (let i = route.path.length - 1; i > 0; i--) {
                const pair = route.pairs[i - 1];
                const [inputAmount, nextPair] = pair.getInputAmount(amounts[i]);
                amounts[i - 1] = inputAmount;
                nextPairs[i - 1] = nextPair;
            }
        }
        const chainId = route.chainId;
        const inputAmount = tradeType === constants_1.TradeType.EXACT_INPUT
            ? amount
            : currency_1.Currency.isNative(route.input)
                ? currencyAmount_1.CurrencyAmount.nativeCurrency(amounts[0].raw, chainId)
                : amounts[0];
        const outputAmount = tradeType === constants_1.TradeType.EXACT_OUTPUT
            ? amount
            : currency_1.Currency.isNative(route.output)
                ? currencyAmount_1.CurrencyAmount.nativeCurrency(amounts[amounts.length - 1].raw, chainId)
                : amounts[amounts.length - 1];
        super({
            details: route,
            type: tradeType,
            inputAmount,
            outputAmount,
            executionPrice: new price_1.Price({
                baseCurrency: inputAmount.currency,
                quoteCurrency: outputAmount.currency,
                denominator: inputAmount.raw,
                numerator: outputAmount.raw,
            }),
            maximumSlippage,
            priceImpact: computePriceImpact(route.midPrice, inputAmount, outputAmount),
            chainId: route.chainId,
            platform: route.pairs[0].platform,
        });
    }
    minimumAmountOut() {
        if (this.tradeType === constants_1.TradeType.EXACT_OUTPUT) {
            return this.outputAmount;
        }
        else {
            const slippageAdjustedAmountOut = new fraction_1.Fraction(constants_1.ONE)
                .add(this.maximumSlippage)
                .invert()
                .multiply(this.outputAmount.raw).quotient;
            return this.outputAmount instanceof tokenAmount_1.TokenAmount
                ? new tokenAmount_1.TokenAmount(this.outputAmount.token, slippageAdjustedAmountOut)
                : currencyAmount_1.CurrencyAmount.nativeCurrency(slippageAdjustedAmountOut, this.chainId);
        }
    }
    maximumAmountIn() {
        if (this.tradeType === constants_1.TradeType.EXACT_INPUT) {
            return this.inputAmount;
        }
        else {
            const slippageAdjustedAmountIn = new fraction_1.Fraction(constants_1.ONE)
                .add(this.maximumSlippage)
                .multiply(this.inputAmount.raw).quotient;
            return this.inputAmount instanceof tokenAmount_1.TokenAmount
                ? new tokenAmount_1.TokenAmount(this.inputAmount.token, slippageAdjustedAmountIn)
                : currencyAmount_1.CurrencyAmount.nativeCurrency(slippageAdjustedAmountIn, this.chainId);
        }
    }
    /**
     * Given a list of pairs, and a fixed amount in, returns the top `maxNumResults` trades that go from an input token
     * amount to an output token, making at most `maxHops` hops.
     * Note this does not consider aggregation, as routes are linear. It's possible a better route exists by splitting
     * the amount in among multiple routes.
     * @param pairs the pairs to consider in finding the best trade
     * @param currencyAmountIn exact amount of input currency to spend
     * @param currencyOut the desired currency out
     * @param maxNumResults maximum number of results to return
     * @param maxHops maximum number of hops a returned trade can make, e.g. 1 hop goes through a single pair
     * @param currentPairs used in recursion; the current list of pairs
     * @param originalAmountIn used in recursion; the original value of the currencyAmountIn parameter
     * @param bestTrades used in recursion; the current list of best trades
     */
    static bestTradeExactIn({ currencyAmountIn, currencyOut, maximumSlippage, pairs, maxHops: { maxNumResults = 3, maxHops = 3 } = {}, 
    // used in recursion.
    currentPairs = [], originalAmountIn = currencyAmountIn, bestTrades = [], }) {
        (0, tiny_invariant_1.default)(maximumSlippage.greaterThan('0'), 'MAXIMUM_SLIPPAGE');
        (0, tiny_invariant_1.default)(pairs && pairs.length > 0, 'PAIRS');
        (0, tiny_invariant_1.default)(maxHops > 0, 'MAX_HOPS');
        (0, tiny_invariant_1.default)(originalAmountIn === currencyAmountIn || currentPairs.length > 0, 'INVALID_RECURSION');
        const chainId = (0, utils_2.tryGetChainId)(currencyAmountIn, currencyOut);
        (0, tiny_invariant_1.default)(chainId !== undefined, 'CHAIN_ID');
        const amountIn = (0, utils_2.wrappedAmount)(currencyAmountIn, chainId);
        const tokenOut = (0, utils_2.wrappedCurrency)(currencyOut, chainId);
        for (let i = 0; i < pairs.length; i++) {
            const pair = pairs[i];
            // pair irrelevant
            if (!pair.token0.equals(amountIn.token) && !pair.token1.equals(amountIn.token))
                continue;
            if (pair.reserve0.equalTo(constants_1.ZERO) || pair.reserve1.equalTo(constants_1.ZERO))
                continue;
            let amountOut;
            try {
                amountOut = pair.getOutputAmount(amountIn)[0];
            }
            catch (error) {
                // input too low
                if (error.isInsufficientInputAmountError) {
                    continue;
                }
                throw error;
            }
            // we have arrived at the output token, so this is the final trade of one of the paths
            if (amountOut.token.equals(tokenOut)) {
                (0, utils_1.sortedInsert)(bestTrades, new UniswapV2Trade(new route_1.Route([...currentPairs, pair], originalAmountIn.currency, currencyOut), originalAmountIn, maximumSlippage, constants_1.TradeType.EXACT_INPUT), maxNumResults, tradeComparator);
            }
            else if (maxHops > 1 && pairs.length > 1) {
                const pairsExcludingThisPair = pairs.slice(0, i).concat(pairs.slice(i + 1, pairs.length));
                // otherwise, consider all the other paths that lead from this token as long as we have not exceeded maxHops
                UniswapV2Trade.bestTradeExactIn({
                    currencyAmountIn: amountOut,
                    currencyOut,
                    maximumSlippage,
                    pairs: pairsExcludingThisPair,
                    maxHops: {
                        maxNumResults,
                        maxHops: maxHops - 1,
                    },
                    currentPairs: [...currentPairs, pair],
                    originalAmountIn,
                    bestTrades,
                });
            }
        }
        return bestTrades[0];
    }
    /**
     * similar to the above method but instead targets a fixed output amount
     * given a list of pairs, and a fixed amount out, returns the top `maxNumResults` trades that go from an input token
     * to an output token amount, making at most `maxHops` hops
     * note this does not consider aggregation, as routes are linear. it's possible a better route exists by splitting
     * the amount in among multiple routes.
     * @param pairs the pairs to consider in finding the best trade
     * @param currencyIn the currency to spend
     * @param currencyAmountOut the exact amount of currency out
     * @param maxNumResults maximum number of results to return
     * @param maxHops maximum number of hops a returned trade can make, e.g. 1 hop goes through a single pair
     * @param currentPairs used in recursion; the current list of pairs
     * @param originalAmountOut used in recursion; the original value of the currencyAmountOut parameter
     * @param bestTrades used in recursion; the current list of best trades
     */
    static bestTradeExactOut({ currencyIn, currencyAmountOut, maximumSlippage, pairs, maxHops: { maxNumResults = 3, maxHops = 3 } = {}, 
    // used in recursion.
    currentPairs = [], originalAmountOut = currencyAmountOut, bestTrades = [], }) {
        (0, tiny_invariant_1.default)(maximumSlippage.greaterThan('0'), 'MAXIMUM_SLIPPAGE');
        (0, tiny_invariant_1.default)(pairs && pairs.length > 0, 'PAIRS');
        (0, tiny_invariant_1.default)(maxHops > 0, 'MAX_HOPS');
        (0, tiny_invariant_1.default)(originalAmountOut === currencyAmountOut || currentPairs.length > 0, 'INVALID_RECURSION');
        const chainId = (0, utils_2.tryGetChainId)(currencyAmountOut, currencyIn);
        (0, tiny_invariant_1.default)(chainId !== undefined, 'CHAIN_ID');
        const amountOut = (0, utils_2.wrappedAmount)(currencyAmountOut, chainId);
        const tokenIn = (0, utils_2.wrappedCurrency)(currencyIn, chainId);
        for (let i = 0; i < pairs.length; i++) {
            const pair = pairs[i];
            // pair irrelevant
            if (!pair.token0.equals(amountOut.token) && !pair.token1.equals(amountOut.token))
                continue;
            if (pair.reserve0.equalTo(constants_1.ZERO) || pair.reserve1.equalTo(constants_1.ZERO))
                continue;
            let amountIn;
            try {
                amountIn = pair.getInputAmount(amountOut)[0];
            }
            catch (error) {
                // not enough liquidity in this pair
                if (error.isInsufficientReservesError) {
                    continue;
                }
                throw error;
            }
            // we have arrived at the input token, so this is the first trade of one of the paths
            if (amountIn.token.equals(tokenIn)) {
                (0, utils_1.sortedInsert)(bestTrades, new UniswapV2Trade(new route_1.Route([pair, ...currentPairs], currencyIn, originalAmountOut.currency), originalAmountOut, maximumSlippage, constants_1.TradeType.EXACT_OUTPUT), maxNumResults, tradeComparator);
            }
            else if (maxHops > 1 && pairs.length > 1) {
                const pairsExcludingThisPair = pairs.slice(0, i).concat(pairs.slice(i + 1, pairs.length));
                // otherwise, consider all the other paths that arrive at this token as long as we have not exceeded maxHops
                UniswapV2Trade.bestTradeExactOut({
                    currencyIn,
                    currencyAmountOut: amountIn,
                    maximumSlippage,
                    pairs: pairsExcludingThisPair,
                    maxHops: {
                        maxNumResults,
                        maxHops: maxHops - 1,
                    },
                    currentPairs: [pair, ...currentPairs],
                    originalAmountOut,
                    bestTrades,
                });
            }
        }
        return bestTrades[0];
    }
    swapTransaction(options) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const nativeCurrency = currency_1.Currency.getNative(this.chainId);
            const etherIn = this.inputAmount.currency === nativeCurrency;
            const etherOut = this.outputAmount.currency === nativeCurrency;
            // the router does not support both ether in and out
            (0, tiny_invariant_1.default)(!(etherIn && etherOut), 'ETHER_IN_OUT');
            (0, tiny_invariant_1.default)(options.ttl && options.ttl > 0, 'TTL');
            const routerAddress = this.platform.routerAddress[this.chainId];
            (0, tiny_invariant_1.default)(!!routerAddress, 'ROUTER_ADDRESS_IN_CHAIN');
            const to = (0, utils_1.validateAndParseAddress)(options.recipient);
            const amountIn = toHex(this.maximumAmountIn());
            const amountOut = toHex(this.minimumAmountOut());
            const path = this.route.path.map((token) => token.address);
            const deadline = `0x${(Math.floor(new Date().getTime() / 1000) + options.ttl).toString(16)}`;
            let methodName;
            let args;
            let value = ZERO_HEX;
            switch (this.tradeType) {
                case constants_1.TradeType.EXACT_INPUT:
                    if (etherIn) {
                        methodName = 'swapExactETHForTokens';
                        // (uint amountOutMin, address[] calldata path, address to, uint deadline)
                        args = [amountOut, path, to, deadline];
                        value = amountIn;
                    }
                    else if (etherOut) {
                        methodName = 'swapExactTokensForETH';
                        // (uint amountIn, uint amountOutMin, address[] calldata path, address to, uint deadline)
                        args = [amountIn, amountOut, path, to, deadline];
                        value = ZERO_HEX;
                    }
                    else {
                        methodName = 'swapExactTokensForTokens';
                        // (uint amountIn, uint amountOutMin, address[] calldata path, address to, uint deadline)
                        args = [amountIn, amountOut, path, to, deadline];
                        value = ZERO_HEX;
                    }
                    break;
                case constants_1.TradeType.EXACT_OUTPUT:
                    if (etherIn) {
                        methodName = 'swapETHForExactTokens';
                        // (uint amountOut, address[] calldata path, address to, uint deadline)
                        args = [amountOut, path, to, deadline];
                        value = amountIn;
                    }
                    else if (etherOut) {
                        methodName = 'swapTokensForExactETH';
                        // (uint amountOut, uint amountInMax, address[] calldata path, address to, uint deadline)
                        args = [amountOut, amountIn, path, to, deadline];
                        value = ZERO_HEX;
                    }
                    else {
                        methodName = 'swapTokensForExactTokens';
                        // (uint amountOut, uint amountInMax, address[] calldata path, address to, uint deadline)
                        args = [amountOut, amountIn, path, to, deadline];
                        value = ZERO_HEX;
                    }
                    break;
            }
            return new contracts_1.Contract(routerAddress, router_json_1.default).populateTransaction[methodName](...args, { value });
        });
    }
    get route() {
        return this.details;
    }
}
exports.UniswapV2Trade = UniswapV2Trade;
//# sourceMappingURL=uniswap-v2-trade.js.map