const PEXELS_API_KEY = process.env.PEXELS_API_KEY!;
const PEXELS_API_URL = 'https://api.pexels.com/v1/search';

export async function fetchImageUrl(query: string): Promise<string | null> {
  try {
    const res = await fetch(`${PEXELS_API_URL}?query=${encodeURIComponent(query)}&per_page=1`, {
      headers: {
        Authorization: PEXELS_API_KEY,
      },
    });

    if (!res.ok) {
      console.error('Failed to fetch image from Pexels');
      return null;
    }

    const data = await res.json();
    return data.photos?.[0]?.src?.medium ?? null;
  } catch (error) {
    console.error('Error fetching image:', error);
    return null;
  }
}
