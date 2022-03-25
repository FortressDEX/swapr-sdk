import { ChainId } from '../../../../constants';
interface PoolToken {
    index: number;
    address: string;
    isUnderlying?: boolean;
}
interface GetPoolTokenListResults {
    allTokens: PoolToken[];
    mainTokens: PoolToken[];
    underlyingTokens: PoolToken[];
}
/**
 * Fetches and returns tokens from given pool address
 */
export declare function getPoolTokenList(poolAddress: string, chainId: ChainId): Promise<GetPoolTokenListResults>;
export {};
