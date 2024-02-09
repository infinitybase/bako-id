import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "Fuel Domains Docs",
  description: "Fuel Domains Docs",
  srcDir: 'src',
  outDir: 'dist',

  appearance: 'force-dark',
  head: [
    ['link', { rel: 'icon', href: '/logo.svg', type: 'image/svg+xml' }],
    ['meta', { property: 'og:type', content: 'website' }],
    ['meta', { property: 'og:url', content: 'https://docs.fuel.domains' }],
  ],

  themeConfig: {
    logo: '/logo.svg',
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Waitlist', link: 'https://fuel.domains/' }
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/infinitybase/fuel-domains' },
      { icon: 'x', link: 'https://twitter.com/fuel_domains' },
    ]
  }
})
