/**
 * Platform deposit addresses.
 *
 * These are shared PureNFT addresses used by every user — they are NOT
 * personal wallets. Deposits are matched to a user by the transaction hash
 * the user submits on the Deposit page.
 */
export const DEPOSIT_ADDRESSES = {
  eth: "0x90c415f420Bb6E8deDd66DFF7aBd31728773373E", // ERC-20
  trc20: "TEKFP6xskYUdzz5cKDSSMXE9YWYPXcikXF", // USDT TRC-20
} as const;
