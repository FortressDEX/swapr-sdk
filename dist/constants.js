"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SWPR_CLAIMER_ABI = exports.STAKING_REWARDS_DISTRIBUTION_ABI = exports.STAKING_REWARDS_FACTORY_ABI = exports.MULTICALL2_ADDRESS = exports.MULTICALL_ADDRESS = exports.MULTICALL2_ABI = exports.MULTICALL_ABI = exports.SOLIDITY_TYPE_MAXIMA = exports.SolidityType = exports.defaultProtocolFeeDenominator = exports.defaultSwapFee = exports._10000 = exports._1000 = exports._100 = exports._30 = exports.SECONDS_IN_YEAR = exports._25 = exports.TEN = exports.FIVE = exports.THREE = exports.TWO = exports.ONE = exports.ZERO = exports.MINIMUM_LIQUIDITY = exports.INIT_CODE_HASH = exports.SWPR_WHITELIST_IPFS_HASH = exports.SWPR_CONVERTER_ADDRESS = exports.SWPR_CLAIMER_ADDRESS = exports.STAKING_REWARDS_FACTORY_ADDRESS = exports.ROUTER_ADDRESS = exports.FACTORY_ADDRESS = exports.ZERO_ADDRESS = exports.Rounding = exports.TradeType = exports.ChainId = void 0;
const tslib_1 = require("tslib");
const jsbi_1 = tslib_1.__importDefault(require("jsbi"));
const staking_rewards_distribution_factory_json_1 = tslib_1.__importDefault(require("./abis/staking-rewards-distribution-factory.json"));
exports.STAKING_REWARDS_FACTORY_ABI = staking_rewards_distribution_factory_json_1.default;
const staking_rewards_distribution_json_1 = tslib_1.__importDefault(require("./abis/staking-rewards-distribution.json"));
exports.STAKING_REWARDS_DISTRIBUTION_ABI = staking_rewards_distribution_json_1.default;
const swpr_claimer_json_1 = tslib_1.__importDefault(require("./abis/swpr-claimer.json"));
exports.SWPR_CLAIMER_ABI = swpr_claimer_json_1.default;
const multicall_json_1 = tslib_1.__importDefault(require("./abis/multicall.json"));
exports.MULTICALL_ABI = multicall_json_1.default;
const multicall2_json_1 = tslib_1.__importDefault(require("./abis/multicall2.json"));
exports.MULTICALL2_ABI = multicall2_json_1.default;
const _contracts_json_1 = require("@swapr/core/.contracts.json");
const _contracts_json_2 = require("@swapr/periphery/.contracts.json");
var ChainId;
(function (ChainId) {
    ChainId[ChainId["MAINNET"] = 1] = "MAINNET";
    ChainId[ChainId["RINKEBY"] = 4] = "RINKEBY";
    ChainId[ChainId["XDAI"] = 100] = "XDAI";
    ChainId[ChainId["ARBITRUM_ONE"] = 42161] = "ARBITRUM_ONE";
    ChainId[ChainId["ARBITRUM_RINKEBY"] = 421611] = "ARBITRUM_RINKEBY";
})(ChainId = exports.ChainId || (exports.ChainId = {}));
var TradeType;
(function (TradeType) {
    TradeType[TradeType["EXACT_INPUT"] = 0] = "EXACT_INPUT";
    TradeType[TradeType["EXACT_OUTPUT"] = 1] = "EXACT_OUTPUT";
})(TradeType = exports.TradeType || (exports.TradeType = {}));
var Rounding;
(function (Rounding) {
    Rounding[Rounding["ROUND_DOWN"] = 0] = "ROUND_DOWN";
    Rounding[Rounding["ROUND_HALF_UP"] = 1] = "ROUND_HALF_UP";
    Rounding[Rounding["ROUND_UP"] = 2] = "ROUND_UP";
})(Rounding = exports.Rounding || (exports.Rounding = {}));
exports.ZERO_ADDRESS = '0x0000000000000000000000000000000000000000';
exports.FACTORY_ADDRESS = {
    [ChainId.MAINNET]: _contracts_json_1.mainnet.factory,
    [ChainId.RINKEBY]: _contracts_json_1.rinkeby.factory,
    [ChainId.ARBITRUM_ONE]: _contracts_json_1.arbitrumOne.factory,
    [ChainId.ARBITRUM_RINKEBY]: _contracts_json_1.arbitrumRinkebyTestnet.factory,
    [ChainId.XDAI]: _contracts_json_1.xdai.factory,
};
exports.ROUTER_ADDRESS = {
    [ChainId.RINKEBY]: _contracts_json_2.rinkeby.router,
    [ChainId.MAINNET]: _contracts_json_2.mainnet.router,
    [ChainId.XDAI]: _contracts_json_2.xdai.router,
    [ChainId.ARBITRUM_ONE]: _contracts_json_2.arbitrumOne.router,
    [ChainId.ARBITRUM_RINKEBY]: _contracts_json_2.arbitrumRinkebyTestnet.router,
};
exports.STAKING_REWARDS_FACTORY_ADDRESS = {
    [ChainId.MAINNET]: '0x156F0568a6cE827e5d39F6768A5D24B694e1EA7b',
    [ChainId.RINKEBY]: '0x0f9E49d473B813abe33F1BAB11fa9E16eE850EBa',
    [ChainId.XDAI]: '0xa039793Af0bb060c597362E8155a0327d9b8BEE8',
    [ChainId.ARBITRUM_ONE]: '0xecA7F78d59D16812948849663b26FE10E320f80C',
    [ChainId.ARBITRUM_RINKEBY]: '0x41e657cAdE74f45b7E2F0F4a5AeE0239f2fB4E1F',
};
exports.SWPR_CLAIMER_ADDRESS = {
    [ChainId.MAINNET]: '0x0000000000000000000000000000000000001234',
    [ChainId.RINKEBY]: '0x6D525E4115d339aD4e336bCF4C85A1Fb8f4a594C',
    [ChainId.ARBITRUM_RINKEBY]: '0x99583f330814E04de96C0288FBF82B5E35A009dc',
    [ChainId.ARBITRUM_ONE]: '0xe54942077Df7b8EEf8D4e6bCe2f7B58B0082b0cd',
    [ChainId.XDAI]: '0x0000000000000000000000000000000000001234',
};
// converter only deployed on Arb1
exports.SWPR_CONVERTER_ADDRESS = {
    [ChainId.MAINNET]: '0x0000000000000000000000000000000000001234',
    [ChainId.RINKEBY]: '0x0000000000000000000000000000000000001234',
    [ChainId.ARBITRUM_RINKEBY]: '0x0000000000000000000000000000000000001234',
    [ChainId.ARBITRUM_ONE]: '0x2b058af96175A847Bf3E5457B3A702F807daDdFd',
    [ChainId.XDAI]: '0x0000000000000000000000000000000000001234',
};
exports.SWPR_WHITELIST_IPFS_HASH = 'QmcjTAvDJZU339jrc9Ky2pXKR68R1SjnwdyGSQjt1kad9r';
exports.INIT_CODE_HASH = '0xd306a548755b9295ee49cc729e13ca4a45e00199bbd890fa146da43a50571776';
exports.MINIMUM_LIQUIDITY = jsbi_1.default.BigInt(1000);
// exports for internal consumption
exports.ZERO = jsbi_1.default.BigInt(0);
exports.ONE = jsbi_1.default.BigInt(1);
exports.TWO = jsbi_1.default.BigInt(2);
exports.THREE = jsbi_1.default.BigInt(3);
exports.FIVE = jsbi_1.default.BigInt(5);
exports.TEN = jsbi_1.default.BigInt(10);
exports._25 = jsbi_1.default.BigInt(25);
exports.SECONDS_IN_YEAR = jsbi_1.default.BigInt(31536000);
exports._30 = jsbi_1.default.BigInt(30);
exports._100 = jsbi_1.default.BigInt(100);
exports._1000 = jsbi_1.default.BigInt(1000);
exports._10000 = jsbi_1.default.BigInt(10000);
exports.defaultSwapFee = exports._25;
exports.defaultProtocolFeeDenominator = exports.FIVE;
var SolidityType;
(function (SolidityType) {
    SolidityType["uint8"] = "uint8";
    SolidityType["uint256"] = "uint256";
})(SolidityType = exports.SolidityType || (exports.SolidityType = {}));
exports.SOLIDITY_TYPE_MAXIMA = {
    [SolidityType.uint8]: jsbi_1.default.BigInt('0xff'),
    [SolidityType.uint256]: jsbi_1.default.BigInt('0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff'),
};
const MULTICALL_ADDRESS = {
    [ChainId.MAINNET]: '0xeefba1e63905ef1d7acba5a8513c70307c1ce441',
    [ChainId.RINKEBY]: '0x42ad527de7d4e9d9d011ac45b31d8551f8fe9821',
    [ChainId.ARBITRUM_ONE]: '0xF718F2bd590E5621e53f7b89398e52f7Acced8ca',
    [ChainId.XDAI]: '0xb5b692a88bdfc81ca69dcb1d924f59f0413a602a',
    [ChainId.ARBITRUM_RINKEBY]: '0xf1f8AAc64036cdd399886b1C157B7e3b361093F3',
};
exports.MULTICALL_ADDRESS = MULTICALL_ADDRESS;
const MULTICALL2_ADDRESS = {
    [ChainId.MAINNET]: '0x5ba1e12693dc8f9c48aad8770482f4739beed696',
    [ChainId.RINKEBY]: '0x5ba1e12693dc8f9c48aad8770482f4739beed696',
    [ChainId.ARBITRUM_ONE]: '0xF718F2bd590E5621e53f7b89398e52f7Acced8ca',
    [ChainId.XDAI]: '0xFAa296891cA6CECAF2D86eF5F7590316d0A17dA0',
    [ChainId.ARBITRUM_RINKEBY]: '0x5ba1e12693dc8f9c48aad8770482f4739beed696',
};
exports.MULTICALL2_ADDRESS = MULTICALL2_ADDRESS;
//# sourceMappingURL=constants.js.map