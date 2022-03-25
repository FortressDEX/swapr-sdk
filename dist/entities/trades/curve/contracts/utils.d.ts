import { JsonRpcProvider } from '@ethersproject/providers';
import { ChainId } from '../../../../constants';
export declare const RPC_PROVIDER_LIST: {
    [x: number]: string;
};
/**
 *  Construct a new read-only Provider
 */
export declare const getProvider: (chainId: ChainId) => JsonRpcProvider;
