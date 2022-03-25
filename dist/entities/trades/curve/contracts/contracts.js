"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getExchangeRoutingInfo = exports.getRouter = exports.getBestCurvePoolAndOutput = exports.MAINNET_CONTRACTS = void 0;
const tslib_1 = require("tslib");
const contracts_1 = require("@ethersproject/contracts");
const constants_1 = require("../../../../constants");
const constants_2 = require("../../../../constants");
const tokens_1 = require("../tokens");
// ABIs: trimmed for bundle size
const abi_1 = require("../abi");
const utils_1 = require("./utils");
// Constants
exports.MAINNET_CONTRACTS = {
    addressProvider: '0x0000000022d53366457f9d5e68ec105046fc4383',
    router: '0xfA9a30350048B2BF66865ee20363067c66f67e58',
};
/**
 * Returns the best pool to route a trade through using Curve Registry Exchange contract.
 * The contract is only available on Mainnet.
 * @returns the best pool to route the trade through and expected receive amount
 */
function getBestCurvePoolAndOutput({ amountIn, tokenInAddress, tokenOutAddress, chainId, }) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        if (chainId !== constants_2.ChainId.MAINNET) {
            throw new Error('Best Pool Find is only available on Mainnet');
        }
        const addressProviderContract = new contracts_1.Contract(exports.MAINNET_CONTRACTS.addressProvider, abi_1.ADDRESS_PROVIDER, (0, utils_1.getProvider)(chainId));
        // Curve V2 pools
        const tricryptoCoins = [
            tokens_1.TOKENS_MAINNET.usdt.address.toLowerCase(),
            tokens_1.TOKENS_MAINNET.wbtc.address.toLowerCase(),
            tokens_1.TOKENS_MAINNET.weth.address.toLowerCase(),
        ];
        if (tricryptoCoins.includes(tokenInAddress.toLowerCase()) && tricryptoCoins.includes(tokenOutAddress.toLowerCase())) {
            throw new Error("This pair can't be exchanged");
        }
        const registryExchangeAddress = yield addressProviderContract.get_address(2, {
            gasLimit: 100000, // due to Berlin upgrade. See https://github.com/ethers-io/ethers.js/issues/1474
        });
        const registryExchangeContract = new contracts_1.Contract(registryExchangeAddress, abi_1.REGISTRY_EXCHANGE, (0, utils_1.getProvider)(chainId));
        const [poolAddress, expectedAmountOut] = yield registryExchangeContract.get_best_rate(tokenInAddress, tokenOutAddress, amountIn.toString());
        if (poolAddress === constants_1.ZERO_ADDRESS) {
            return;
        }
        return {
            poolAddress,
            expectedAmountOut,
            registryExchangeAddress,
        };
    });
}
exports.getBestCurvePoolAndOutput = getBestCurvePoolAndOutput;
/**
 * Returns Curve's Smart Router contract instance
 */
function getRouter() {
    return new contracts_1.Contract(exports.MAINNET_CONTRACTS.router, abi_1.CURVE_ROUTER, (0, utils_1.getProvider)(constants_2.ChainId.MAINNET));
}
exports.getRouter = getRouter;
/**
 * Returns routing information from the Curve Smart Router. The router is only available on Mainnet.
 * The contract calls reverts if there no route is found
 * @returns the routing information
 */
function getExchangeRoutingInfo({ amountIn, tokenInAddress, tokenOutAddress, }) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        const routerContract = getRouter();
        try {
            const params = [tokenInAddress, tokenOutAddress, amountIn.toString()];
            const exchangeRoutingRes = yield routerContract.get_exchange_routing(...params, {
                from: constants_1.ZERO_ADDRESS,
            });
            const [routes, indices, expectedAmountOut] = exchangeRoutingRes;
            return {
                expectedAmountOut,
                indices,
                routes,
            };
        }
        catch (error) {
            // Throw any non-EVM errors
            if (!error.message.includes('execution reverted')) {
                throw error;
            }
        }
        return;
    });
}
exports.getExchangeRoutingInfo = getExchangeRoutingInfo;
//# sourceMappingURL=contracts.js.map