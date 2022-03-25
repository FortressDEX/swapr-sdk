"use strict";
// ABIs
Object.defineProperty(exports, "__esModule", { value: true });
exports.CURVE_ETHXERC20_256_ABI = exports.CURVE_ETHXERC20_ABI = exports.CURVE_WETH_ERC20_POOL_ABI = exports.CURVE_CRYPTO_SWAP_ABI = exports.CURVE_EURSPOOL_ABI = exports.CURVE_3POOL_UNDERLYING_ABI = exports.CURVE_3POOL_ABI = void 0;
const common_1 = require("./common");
// 3pool ABI which has USDC, USDT and WXDAI
exports.CURVE_3POOL_ABI = [
    common_1.poolMethods['view']['fee'],
    common_1.poolMethods['view']['get_dy(int128,int128,uint256)'],
    common_1.poolMethods['nonpayable']['exchange(int128,int128,uint256,uint256)'],
    common_1.poolMethods['nonpayable']['exchange_underlying(uint256,uint256,uint256,uint256,address)'],
];
// 3pool ABI which has USDC, USDT and WXDAI
exports.CURVE_3POOL_UNDERLYING_ABI = [
    common_1.poolMethods['view']['fee'],
    common_1.poolMethods['view']['get_dy(int128,int128,uint256)'],
    common_1.poolMethods['nonpayable']['exchange(int128,int128,uint256,uint256)'],
    common_1.poolMethods['nonpayable']['exchange_underlying(int128,int128,uint256,uint256)'],
];
// 3pool ABI which has USDC, USDT and WXDAI
exports.CURVE_EURSPOOL_ABI = [
    common_1.poolMethods['view']['fee'],
    common_1.poolMethods['view']['get_dy(uint256,uint256,uint256)'],
    common_1.poolMethods['nonpayable']['exchange(int128,int128,uint256,uint256)'],
];
exports.CURVE_CRYPTO_SWAP_ABI = [
    common_1.poolMethods['view']['fee'],
    common_1.poolMethods['view']['get_dy_underlying(uint256,uint256,uint256)'],
    common_1.poolMethods['nonpayable']['exchange_underlying(uint256,uint256,uint256,uint256)'],
    common_1.poolMethods['nonpayable']['exchange_underlying(uint256,uint256,uint256,uint256,address)'],
];
exports.CURVE_WETH_ERC20_POOL_ABI = [
    common_1.poolMethods['view']['fee'],
    common_1.poolMethods['view']['get_dy(uint256,uint256,uint256)'],
    common_1.poolMethods['payable']['exchange(uint256,uint256,uint256,uint256)'],
    common_1.poolMethods['payable']['exchange(uint256,uint256,uint256,uint256,bool)'],
    common_1.poolMethods['payable']['exchange(uint256,uint256,uint256,uint256,bool,address)'],
    common_1.poolMethods['payable']['exchange_underlying(uint256,uint256,uint256,uint256)'],
    common_1.poolMethods['payable']['exchange_underlying(uint256,uint256,uint256,uint256,address)'],
];
exports.CURVE_ETHXERC20_ABI = [
    common_1.poolMethods['view']['fee'],
    common_1.poolMethods['view']['get_dy(int128,int128,uint256)'],
    common_1.poolMethods['payable']['exchange(int128,int128,uint256,uint256)'],
];
exports.CURVE_ETHXERC20_256_ABI = [
    common_1.poolMethods['view']['fee'],
    common_1.poolMethods['view']['get_dy(uint256,uint256,uint256)'],
    common_1.poolMethods['payable']['exchange(uint256,uint256,uint256,uint256)'],
    common_1.poolMethods['payable']['exchange(uint256,uint256,uint256,uint256,bool)'],
    common_1.poolMethods['payable']['exchange_underlying(uint256,uint256,uint256,uint256)'],
];
//# sourceMappingURL=abi.js.map