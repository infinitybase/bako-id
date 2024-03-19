import { defineConfig } from 'vitepress';

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: 'Bako ID',
  description: 'Bako ID Docs',
  srcDir: 'src',
  outDir: 'dist',

  appearance: 'force-dark',
  head: [
    ['link', { rel: 'icon', href: '/logo.svg', type: 'image/svg+xml' }],
    ['meta', { property: 'og:type', content: 'website' }],
    ['meta', { property: 'og:url', content: 'https://docs.fuel.domains' }],
    ['meta', { property: 'og:image', href: '/logo.png' }],
    ['link', { rel: 'preconnect', href: 'https://fonts.googleapis.com' }],
    ['link', { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' }],
    ['link', {
      href: 'https://fonts.googleapis.com/css2?family=Inter:wght@100;200;300;400;500;600;700&family=Roboto:wght@300;400;500&display=swap',
      rel: 'stylesheet'
    }]
  ],

  themeConfig: {
    logo: '/logo.svg',
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Waitlist', link: 'https://fuel.domains/' }
    ],

    sidebar: [
      {
        text: 'Learn', collapsed: false, items: [
          { text: 'Introduction', link: '/' },
          { text: 'Protocol', link: '/sdk/install' },
          { text: 'Getting a domain', link: '/sdk/resolver' },
        ]
      },
      {
        text: 'Developers', collapsed: false, items: [
          { text: 'SDK Installation', link: '/sdk/install' },
          { text: 'Getting a domain', link: '/sdk/resolver' },
        ]
      }
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/infinitybase/bako-id' },
      { icon: 'x', link: 'https://twitter.com/bakoidentity' }
    ]
  }
});
