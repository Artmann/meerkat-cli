import { SuggestionResponse } from '.'

export const example: SuggestionResponse = {
  suggestions: [
    {
      explanation: "Link to the category page for 'Snabbt och Enkelt'",
      isExternal: false,
      isNewPage: false,
      pageUrl: 'https://gustavskitchen.se/recipes/mediterranean-pasta',
      section: 'Within the introduction',
      targetUrl: 'https://gustavskitchen.se/categories/snabbt-och-enkelt',
      text: 'snabbt, enkelt och otroligt gott'
    },
    {
      explanation: "Link to the category page for 'Medelhavet'",
      isExternal: false,
      isNewPage: false,
      pageUrl: 'https://gustavskitchen.se/recipes/mediterranean-pasta',
      section: 'Within the introduction',
      targetUrl: 'https://gustavskitchen.se/categories/medelhavet',
      text: 'medelhavsinspirerad'
    },
    {
      explanation:
        'Link to an article discussing garlic-infused olive oil varieties',
      isExternal: false,
      isNewPage: true,
      pageUrl: 'https://gustavskitchen.se/recipes/mediterranean-pasta',
      section: 'Within the introduction',
      targetUrl: 'https://gustavskitchen.se/articles/olive-oil-guide',
      text: 'vitlöksdoftande olivolja'
    },
    {
      explanation:
        "Link to a page or resource explaining what ASC certification means and why it's important for sustainable seafood.",
      isExternal: false,
      isNewPage: true,
      pageUrl: 'https://gustavskitchen.se/recipes/mediterranean-pasta',
      section: 'Within "Viktiga saker att tänka på"',
      targetUrl: 'https://gustavskitchen.se/articles/what-is-asc-cerfication',
      text: 'ASC-certifierade'
    },
    {
      explanation:
        'Link to an article about cooking pasta properly, emphasizing the importance of salting the water.',
      isExternal: false,
      isNewPage: true,
      pageUrl: 'https://gustavskitchen.se/recipes/mediterranean-pasta',
      section: 'Within "Viktiga saker att tänka på"',
      targetUrl: 'https://gustavskitchen.se/articles/how-to-cook-pasta-guide',
      text: 'pastavattnet ska smaka som havet'
    }
  ]
}
