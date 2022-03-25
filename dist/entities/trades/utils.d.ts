import { CurrencyAmount } from '../fractions/currencyAmount';
import { TokenAmount } from '../fractions/tokenAmount';
import { ChainId } from '../../constants';
import { Currency } from '../currency';
import { Token } from '../token';
export declare function wrappedAmount(currencyAmount: CurrencyAmount, chainId: ChainId): TokenAmount;
export declare function wrappedCurrency(currency: Currency, chainId: ChainId): Token;
export declare function tryGetChainId(currencyAmount: CurrencyAmount, currency: Currency): ChainId | undefined;
