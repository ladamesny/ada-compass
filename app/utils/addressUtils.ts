/**
 * Utility functions for working with Cardano addresses
 */

/**
 * Checks if a string is likely a Cardano wallet address
 * @param address The address to check
 * @returns True if the address is likely a Cardano address
 */
export function isCardanoAddress(address: string): boolean {
  // Basic validation - check if it starts with addr1 (Shelley era address)
  // or stake1 (stake address)
  return /^(addr1|stake1)[a-zA-Z0-9]{54,}$/.test(address);
}

/**
 * Checks if a string is likely a Cardano stake address
 * @param address The address to check
 * @returns True if the address is likely a stake address
 */
export function isStakeAddress(address: string): boolean {
  return /^stake1[a-zA-Z0-9]{54,}$/.test(address);
}

/**
 * Formats an address for display, truncating the middle
 * @param address The address to format
 * @param startChars Number of characters to show at the start
 * @param endChars Number of characters to show at the end
 * @returns Formatted address like "addr1abc...def"
 */
export function formatAddress(address: string, startChars = 10, endChars = 6): string {
  if (!address || address.length <= startChars + endChars) {
    return address;
  }
  
  return `${address.substring(0, startChars)}...${address.substring(address.length - endChars)}`;
}

/**
 * Gets the stake address from a wallet address if possible
 * Note: This is a simplified approach. In a real implementation, you would
 * use the Cardano SDK to properly derive the stake address.
 * 
 * @param address Wallet address
 * @returns Stake address if derivable, or the original address
 */
export function getStakeAddress(address: string): string {
  // If it's already a stake address, return it
  if (isStakeAddress(address)) {
    return address;
  }
  
  // In a real implementation, we would use the Cardano SDK to derive
  // the stake address. For now, we'll just return the original address
  // and let the TapTools API handle it.
  return address;
} 