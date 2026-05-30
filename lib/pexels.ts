export async function fetchImage(query: string): Promise<string> {
  const res = await fetch(
    `https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&per_page=1&orientation=landscape`,
    {
      headers: {
        Authorization: process.env.PEXELS_API_KEY!,
      },
    }
  );
  const data = await res.json();
  return data.photos?.[0]?.src?.large || '/placeholder.jpg';
}