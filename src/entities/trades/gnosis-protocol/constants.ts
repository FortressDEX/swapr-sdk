/**
 * Default App Data for submitting orders to GPv2 API
 */
export const ORDER_APP_DATA = '0x0000000000000000000000000000000000000000000000000000000000000000'

/**
 * Default placeholder address for fetching quotes from GPV2 API when a wallet is not connected
 */
export const ORDER_PLACEHOLDER_ADDRESS = '0xAb5801a7D398351b8bE11C439e05C5B3259aeC9B'

/**
 * A mapping for the GPv2 API class constructor
 */
export const CHAIN_ID_TO_NETWORK = {
  1: 'mainnet',
  100: 'xdai',
  4: 'rinkeby',
}
