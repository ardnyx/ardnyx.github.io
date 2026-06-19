/**
 * Estimates reading time from raw markdown/text content.
 * Uses 200 wpm — slightly conservative for technical writing.
 */
export function getReadingTime(content: string): string {
  const wordsPerMinute = 200;
  // Strip markdown syntax and HTML tags for a cleaner word count
  const cleaned = content
    .replace(/```[\s\S]*?```/g, '') // code blocks
    .replace(/`[^`]+`/g, '')        // inline code
    .replace(/!\[.*?\]\(.*?\)/g, '') // images
    .replace(/\[.*?\]\(.*?\)/g, '')  // links
    .replace(/#{1,6}\s/g, '')        // headings
    .replace(/[*_~|]/g, '')          // emphasis
    .trim();

  const words = cleaned.split(/\s+/).filter(Boolean).length;
  const minutes = Math.max(1, Math.ceil(words / wordsPerMinute));
  return `${minutes} min read`;
}
