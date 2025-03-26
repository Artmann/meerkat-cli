import fetch from 'node-fetch'
import { parse } from 'node-html-parser'

export async function fetchUrlsFromSitemap(url: string): Promise<string[]> {
  const response = await fetch(url)

  if (!response.ok) {
    throw new Error(
      `Failed to fetch sitemap: ${response.status} - ${response.statusText} `
    )
  }

  const xml = await response.text()

  const doc = parse(xml)

  const urlElements = doc.querySelectorAll('url')

  const blocks = urlElements
    .map((element) => {
      const url = element.querySelector('loc')?.textContent
      const priority = element.querySelector('priority')?.textContent ?? '0.0'

      return { url, priority }
    })
    .filter((url) => url.url) as { url: string; priority: string }[]

  return blocks
    .sort((a, b) => parseFloat(b.priority) - parseFloat(a.priority))
    .map((block) => block.url)
}