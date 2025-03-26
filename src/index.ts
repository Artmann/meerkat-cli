import chalk from 'chalk'
import { configDotenv } from 'dotenv'
import ora from 'ora'
import { argv } from 'process'

import { fetchUrlsFromSitemap } from './sitemap'
import { fetchWebsiteContent } from './scraper'
import { generateSuggestions, Suggestion } from './suggestions'

async function main() {
  configDotenv()

  if (!process.env['GOOGLE_GENERATIVE_AI_API_KEY']) {
    console.log(
      chalk.red(
        'Please set the GOOGLE_GENERATIVE_AI_API_KEY environment variable.'
      )
    )

    process.exit(1)
  }

  const sitemapUrl = argv[2]
  const pageUrl = argv[3]

  console.log(chalk.blue())

  const urls = await runTask(
    `Fetching the sitemap from ${sitemapUrl}.`,
    async ({ succeed }) => {
      const urls = await fetchUrlsFromSitemap(sitemapUrl)

      succeed(`Found ${chalk.bold(urls.length)} urls.`)

      return urls
    }
  )

  const pageContent = await runTask(
    `Fetching the content from ${pageUrl}.`,
    async ({ succeed }) => {
      const content = await fetchWebsiteContent(pageUrl)

      succeed(
        `Found website content containing ${chalk.bold(content.length)} characters.`
      )

      return content
    }
  )

  const suggestions = await runTask(
    'Generating suggestions',
    async ({ succeed }) => {
      const suggestions = await generateSuggestions(urls, pageContent)

      succeed(`Generated ${chalk.bold(suggestions.length)} suggestions.`)

      return suggestions
    }
  )

  console.log('')

  const existingPageSuggestions = suggestions.filter(
    (suggestion) => !suggestion.isExternal && !suggestion.isNewPage
  )
  const newPageSuggestions = suggestions.filter(
    (suggestion) => suggestion.isNewPage
  )
  const externalPageSuggestions = suggestions.filter(
    (suggestion) => suggestion.isExternal
  )

  if (existingPageSuggestions.length > 0) {
    console.log(chalk.blue(chalk.bold('\nExisting pages\n')))

    for (const suggestion of existingPageSuggestions) {
      printSuggestion(suggestion)
    }
  }

  if (externalPageSuggestions.length > 0) {
    console.log(chalk.blue(chalk.bold('\nExternal pages\n')))

    for (const suggestion of externalPageSuggestions) {
      printSuggestion(suggestion)
    }
  }

  if (newPageSuggestions.length > 0) {
    console.log(chalk.blue(chalk.bold('\nNew pages\n')))

    for (const suggestion of newPageSuggestions) {
      printSuggestion(suggestion)
    }
  }

  if (suggestions.length === 0) {
    console.log(chalk.blue('\nWe were not able to generate any suggestions.\n'))
  }

  process.exit(0)
}

function printSuggestion(suggestion: Suggestion): void {
  console.log(`"${suggestion.text}"`)
  console.log(suggestion.targetUrl)

  console.log(chalk.dim(suggestion.section))
  console.log(chalk.dim(suggestion.explanation))
  console.log('---------------------------------')
}

type FailFunction = (text: string) => void
type SucceedFunction = (text: string) => void
type TaskProps = {
  fail: FailFunction
  succeed: SucceedFunction
}

async function runTask<T>(
  description: string,
  fn: (props: TaskProps) => Promise<T>
): Promise<T> {
  const spinner = ora(chalk.blue(description)).start()

  let didFail = false
  let didSucceed = false

  const props: TaskProps = {
    fail: (text: string) => {
      spinner.fail(chalk.red(text))

      didFail = true
    },
    succeed: (text: string) => {
      spinner.succeed(chalk.blue(text))

      didSucceed = true
    }
  }

  const result = await fn(props)

  if (!didFail && !didSucceed) {
    spinner.succeed()
  }

  return result
}

main().catch((error: any) => {
  console.error(error)

  process.exit(1)
})
