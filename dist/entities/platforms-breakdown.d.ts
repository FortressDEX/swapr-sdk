import { ChainId } from '../constants';
import { Currency } from './currency';
import { Price } from './fractions/price';
import { Percent } from './fractions';
export interface Platform {
    name: string;
    percentage: Percent;
}
export declare class Breakdown {
    readonly chainId: ChainId;
    readonly platforms: Platform[];
    readonly input: Currency;
    readonly output: Currency;
    readonly midPrice: Price;
    constructor(chainId: ChainId, platforms: Platform[], input: Currency, output: Currency, midPrice: Price);
}
