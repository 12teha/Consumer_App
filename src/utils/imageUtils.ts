/**
 * Utility functions for handling image URLs
 */

const CLOUDFRONT_URL = 'd24rozqnh2m4pk.cloudfront.net';
const AMAZONAWS_DOMAIN = 'amazonaws.com';

/**
 * Transforms S3 URLs to CloudFront URLs for optimized image delivery
 * @param url - The original image URL from the API (S3 URL)
 * @returns The CloudFront URL for the image
 *
 * Example:
 * Input: https://offerbeez.s3.ap-south-1.amazonaws.com/kyc-docs/1759587491399-9mjnv.png
 * Output: https://d24rozqnh2m4pk.cloudfront.net/kyc-docs/1759587491399-9mjnv.png
 */
export function transformImageUrl(url: string | undefined | null): string {
  // Return empty string if no URL provided
  if (!url) {
    return '';
  }

  // Don't transform banner S3 URLs (obz-banners bucket) - return as-is
  if (url.includes('obz-banners.s3')) {
    console.log('🎯 Banner S3 URL detected, returning as-is:', url);
    return url;
  }

  // Don't transform category icon S3 URLs (obz-icons bucket) - return as-is (public bucket)
  if (url.includes('obz-icons.s3')) {
    console.log('🎨 Category icon S3 URL detected, returning as-is:', url);
    return url;
  }

  // If URL is not from amazonaws.com, return as-is
  if (!url.includes(AMAZONAWS_DOMAIN)) {
    return url;
  }

  try {
    // Extract the path from the S3 URL
    // URL format: https://offerbeez.s3.ap-south-1.amazonaws.com/path/to/image.png
    const urlObj = new URL(url);
    const path = urlObj.pathname; // This will be /path/to/image.png

    // Construct CloudFront URL
    return `https://${CLOUDFRONT_URL}${path}`;
  } catch (error) {
    console.error('Error transforming image URL:', error);
    return url; // Return original URL if transformation fails
  }
}
