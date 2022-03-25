import { TradeType } from '../../constants';
import { Currency } from '../currency';
import { CurrencyAmount } from '../fractions/currencyAmount';
import { Percent } from '../fractions/percent';
import { Pair } from '../pair';
import { Route } from '../route';
import { TradeWithSwapTransaction } from './interfaces/trade';
import { TradeOptions } from './interfaces/trade-options';
import type { UnsignedTransaction } from '@ethersproject/transactions';
export interface UniswapV2TradeBestTradeExactParams {
    maxHops?: BestTradeOptions;
    maximumSlippage: Percent;
    currentPairs?: Pair[];
    bestTrades?: UniswapV2Trade[];
}
export interface UniswapV2TradeBestTradeExactInParams extends UniswapV2TradeBestTradeExactParams {
    currencyAmountIn: CurrencyAmount;
    currencyOut: Currency;
    pairs: Pair[];
    originalAmountIn?: CurrencyAmount;
}
export interface UniswapV2TradeBestTradeExactOutParams extends UniswapV2TradeBestTradeExactParams {
    currencyIn: Currency;
    currencyAmountOut: CurrencyAmount;
    pairs: Pair[];
    originalAmountOut?: CurrencyAmount;
}
interface InputOutput {
    readonly inputAmount: CurrencyAmount;
    readonly outputAmount: CurrencyAmount;
}
export declare function inputOutputComparator(a: InputOutput, b: InputOutput): number;
export declare function tradeComparator(a: UniswapV2Trade, b: UniswapV2Trade): number;
export interface BestTradeOptions {
    maxNumResults?: number;
    maxHops?: number;
}
/**
 * Represents a trade executed against a list of pairs.
 * Does not account for slippage, i.e. trades that front run this trade and move the price.
 */
export declare class UniswapV2Trade extends TradeWithSwapTransaction {
    constructor(route: Route, amount: CurrencyAmount, maximumSlippage: Percent, tradeType: TradeType);
    minimumAmountOut(): CurrencyAmount;
    maximumAmountIn(): CurrencyAmount;
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
    static bestTradeExactIn({ currencyAmountIn, currencyOut, maximumSlippage, pairs, maxHops: { maxNumResults, maxHops }, currentPairs, originalAmountIn, bestTrades, }: UniswapV2TradeBestTradeExactInParams): UniswapV2Trade | undefined;
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
    static bestTradeExactOut({ currencyIn, currencyAmountOut, maximumSlippage, pairs, maxHops: { maxNumResults, maxHops }, currentPairs, originalAmountOut, bestTrades, }: UniswapV2TradeBestTradeExactOutParams): UniswapV2Trade | undefined;
    swapTransaction(options: TradeOptions): Promise<UnsignedTransaction>;
    get route(): Route;
}
export {};
