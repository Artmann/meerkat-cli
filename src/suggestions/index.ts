import { google } from '@ai-sdk/google'
import { generateObject } from 'ai'
import { z } from 'zod'
import { examples } from './examples'

const suggestionSchema = z.object({
  explanation: z.string(),
  isExternal: z.boolean(),
  isNewPage: z.boolean(),
  pageUrl: z.string(),
  section: z.string(),
  targetUrl: z.string(),
  text: z.string()
})

const suggestionResponseSchema = z.object({
  suggestions: z.array(suggestionSchema)
})

export type Suggestion = z.infer<typeof suggestionSchema>
export type SuggestionResponse = z.infer<typeof suggestionResponseSchema>

export async function generateSuggestions(
  urls: string[],
  pageContent: string
): Promise<Suggestion[]> {
  const urlBlocks = urls.slice(0, 200).map((url) => `<url>${url}</url>`)
  const truncatedPageContent = pageContent.slice(0, 20_000)

  const model = google('gemini-2.0-flash')

  const exampleBlocks = examples.map(
    (example) => `<example>${example}</example>`
  )

  const systemPrompt = `Your task is to generate suggestions of internal links to other pages on the
    website. You will be given a list of URLs and the content of the page you are generating
    suggestions for. The suggestions should be based on the content of the page and the
    URLs you have been given.

    You can also suggest linking to reputable sources or articles that are not on the website.
    You can also suggest creating new pages if you think there is a gap in the content.
    Prioritize suggesting internal links to existing pages.

    - Don't make multiple suggestion with the same anchor text.
    - Don't make multiple suggestion for the same page.
    - Don't suggest linking to pages that are already linked in the content.

    Internal links help search engines find and index all site pages. They show how your pages relate
    to each other, which tells Google which pages are most important. This distribution of link
    equity can boost the visibility of less prominent pages.

    Users also benefit from a clear path to more information, which increases the total time they
    spend on your site. Google sees longer user engagement as a positive ranking signal.

    Instead of generic phrases like "click here" or "read more," use specific keywords that accurately
    describe the linked content. This helps both users and search engines understand what they'll
    find when clicking the link. For example, rather than "learn more about our services," use
    "explore our MongoDB database migration services."

    While there's no perfect number, aim for around 3-7 internal links per 1000 words of content.
    More importantly, ensure each link genuinely enhances the reader's journey by connecting to truly
    relevant content. Links should feel like helpful suggestions, not forced insertions.

    <examples>
      ${JSON.stringify(exampleBlocks.join('\n'))}
    </examples>
  `

  const prompt = `Generate 10 to 20 suggestions for:

  <page_content>
    ${truncatedPageContent}
  </page_content>

  Here is the other pages on the website:
  <urls>
    ${urlBlocks.join('\n')}
  </urls>
`

  const { object, usage } = await generateObject({
    model,
    schema: suggestionResponseSchema,
    prompt,
    system: systemPrompt
  })

  return object.suggestions
}
