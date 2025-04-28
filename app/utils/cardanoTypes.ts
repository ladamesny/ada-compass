/**
 * Type definitions for the Cardano wallet API (CIP-30)
 * Reference: https://github.com/cardano-foundation/CIPs/blob/master/CIP-0030/README.md
 */

export interface CardanoWalletAPI {
  name: string;
  icon?: string;
  enable: () => Promise<CardanoWalletInstance>;
  isEnabled: () => Promise<boolean>;
  apiVersion: string;
  [key: string]: any;
}

export interface CardanoWalletInstance {
  getBalance: () => Promise<string>;
  getUsedAddresses: () => Promise<string[]>;
  getUnusedAddresses: () => Promise<string[]>;
  getChangeAddress: () => Promise<string>;
  getRewardAddresses?: () => Promise<string[]>;
  getUtxos: () => Promise<string[] | undefined>;
  signTx: (tx: string, partialSign: boolean) => Promise<string>;
  signData: (address: string, payload: string) => Promise<string>;
  submitTx: (tx: string) => Promise<string>;
  getNetworkId: () => Promise<number>;
  getCollateral?: () => Promise<string[]>;
  getAddress?: () => Promise<string>;
  experimental?: {
    [key: string]: any;
  };
  [key: string]: any;
}

export interface CardanoAPI {
  [key: string]: CardanoWalletAPI;
}

// Extend the global Window interface
declare global {
  interface Window {
    cardano: CardanoAPI | undefined;
  }
} 