import { JsonRpcProvider } from '@ethersproject/providers';
import { CurrencyAmount } from '../fractions/currencyAmount';
import { TokenAmount } from '../fractions/tokenAmount';
import { ChainId } from '../../constants';
import { Currency } from '../currency';
import { Token } from '../token';
export declare function wrappedAmount(currencyAmount: CurrencyAmount, chainId: ChainId): TokenAmount;
export declare function wrappedCurrency(currency: Currency, chainId: ChainId): Token;
export declare function tryGetChainId(currencyAmount: CurrencyAmount, currency: Currency): ChainId | undefined;
/**
 *
 */
export declare const RPC_PROVIDER_LIST: {
    [x: number]: string;
};
/**
 * Returns a RPC provider for the given chainId.
 * @param chainId The chainId
 * @returns The RPC provider
 */
export declare function getProvider(chainId: ChainId): JsonRpcProvider;
