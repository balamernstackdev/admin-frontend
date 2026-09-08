export const extractThumbnailUrl = (url: string): string | null => {
  if (!url) return null;

  try {
    const urlObj = new URL(url);
    const hostname = urlObj.hostname.toLowerCase();

    // YouTube
    if (hostname.includes('youtube.com') || hostname.includes('youtu.be')) {
      let videoId = '';
      if (hostname.includes('youtu.be')) {
        videoId = urlObj.pathname.slice(1);
      } else if (urlObj.searchParams.has('v')) {
        videoId = urlObj.searchParams.get('v') || '';
      } else if (urlObj.pathname.startsWith('/embed/')) {
        videoId = urlObj.pathname.split('/embed/')[1];
      } else if (urlObj.pathname.startsWith('/shorts/')) {
        videoId = urlObj.pathname.split('/shorts/')[1];
      }

      if (videoId) {
        // Strip any extra path parameters
        videoId = videoId.split(/[?#]/)[0];
        return `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
      }
    }
  } catch (e) {
    // Invalid URL
    return null;
  }

  return null;
};
