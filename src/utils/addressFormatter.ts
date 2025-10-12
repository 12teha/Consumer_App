export function formatAddress(address: string): string {
  if (!address) return 'Location not set';

  // If it looks like coordinates, return as is for now
  if (address.includes('°') || /^\d+\.\d+,\s*\d+\.\d+$/.test(address)) {
    return 'Tap to set readable address';
  }

  // If it's already a properly formatted address, return as is
  if (address.includes(',') && !address.includes('°')) {
    return address;
  }

  // Clean up any unwanted parts
  let cleanAddress = address
    .replace(/^\d+\.\d+,\s*\d+\.\d+/, '') // Remove lat,lng at start
    .replace(/\d+\.\d+°[NS],?\s*\d+\.\d+°[EW],?/g, '') // Remove degree notation
    .trim();

  // If empty after cleaning, provide fallback
  if (!cleanAddress) {
    return 'Tap to set your location';
  }

  return cleanAddress;
}

export function isCoordinateString(address: string): boolean {
  if (!address) return false;

  // Check for various coordinate formats
  const coordinatePatterns = [
    /^\d+\.\d+,\s*\d+\.\d+$/, // 12.34, 56.78
    /^\d+\.\d+°[NS],?\s*\d+\.\d+°[EW]$/, // 12.34°N, 56.78°E
    /^[+-]?\d+\.\d+[,\s]+[+-]?\d+\.\d+$/ // +12.34, -56.78
  ];

  return coordinatePatterns.some(pattern => pattern.test(address.trim()));
}