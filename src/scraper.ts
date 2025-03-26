export async function fetchWebsiteContent(url: string): Promise<string> {
  const params = new URLSearchParams()

  params.append('url', url)
  params.append('title', 'true')
  params.append('links', 'true')
  params.append('clean', 'true')

  const apiUrl = `https://urltomarkdown.herokuapp.com/?${params.toString()}`

  const response = await fetch(apiUrl)

  const markdown = await response.text()

  return markdown
}
