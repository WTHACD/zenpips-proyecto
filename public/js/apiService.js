
/**
 * Calls an endpoint of our internal API and returns the data.
 * @param {string} endpoint - The endpoint to call (e.g., 'news', 'testimonials').
 * @returns {Promise<Object>} The data in JSON format.
 */
async function fetchFromAPI(endpoint) {
  const response = await fetch(`/api/${endpoint}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch from /api/${endpoint}`);
  }
  return await response.json();
}

/**
 * Gets the latest news.
 */
export async function getNews() {
  return await fetchFromAPI('news');
}

/**
 * Gets the testimonials.
 */
export async function getTestimonials() {
  return await fetchFromAPI('testimonials');
}