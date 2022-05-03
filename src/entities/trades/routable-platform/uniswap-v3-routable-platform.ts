import {
  BigintIsh,
  ChainId,
  _30
} from '../../../constants'
import { RoutablePlatform } from './routable-platform'

const UNISWAP_FACTORY_ADDRESS = '0x1F98431c8aD98523631AE4a59f267346ea31F984'
const UNISWAP_ROUTER_ADDRESS = '0xE592427A0AEce92De3Edee1F18E0157C05861564'

export interface UniswapV3RoutablePlatformConstructorParams {
  chainIds: ChainId[]
  name: string
  factoryAddress: { [supportedChainId in ChainId]?: string }
  routerAddress: { [supportedChainId in ChainId]?: string }
  initCodeHash: string
  defaultSwapFee: BigintIsh
}

/**
 * A platform to which Swapr can route through.
 */
export class UniswapV3RoutablePlatform extends RoutablePlatform {
  public readonly factoryAddress: { [supportedChainId in ChainId]?: string }
  public readonly routerAddress: { [supportedChainId in ChainId]?: string }
  public readonly initCodeHash: string
  public readonly defaultSwapFee: BigintIsh

  public static readonly UNISWAP = new UniswapV3RoutablePlatform({
    chainIds: [ChainId.MAINNET, ChainId.RINKEBY],
    name: 'Uniswap v3',
    factoryAddress: { [ChainId.MAINNET]: UNISWAP_FACTORY_ADDRESS, [ChainId.RINKEBY]: UNISWAP_FACTORY_ADDRESS },
    routerAddress: { [ChainId.MAINNET]: UNISWAP_ROUTER_ADDRESS, [ChainId.RINKEBY]: UNISWAP_ROUTER_ADDRESS },
    initCodeHash: '0x96e8ac4277198ff8b6f785478aa9a39f403cb768dd02cbee326c3e7da348845f',
    defaultSwapFee: _30
  })

  public constructor({
    chainIds,
    name,
    factoryAddress,
    routerAddress,
    initCodeHash,
    defaultSwapFee
  }: UniswapV3RoutablePlatformConstructorParams) {
    super(chainIds, name)
    this.factoryAddress = factoryAddress
    this.routerAddress = routerAddress
    this.initCodeHash = initCodeHash
    this.defaultSwapFee = defaultSwapFee
  }

  public supportsChain(chainId: ChainId): boolean {
    return !!this.factoryAddress[chainId] && !!this.routerAddress[chainId]
  }

}
