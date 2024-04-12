import type { Theme } from 'vitepress';
import DefaultTheme from 'vitepress/theme';
// https://vitepress.dev/guide/custom-theme
import { h } from 'vue';
import ContractDeployment from '../components/contract-deployments.vue';
import DomainPreview from '../components/domain-preview.vue';
import './style.css';

export default {
  extends: DefaultTheme,
  Layout: () => {
    return h(DefaultTheme.Layout, null, {
      // https://vitepress.dev/guide/extending-default-theme#layout-slots
    });
  },
  enhanceApp({ app, router, siteData }) {
    // ...
    app.component('DomainPreview', DomainPreview);
    app.component('ContractDeployment', ContractDeployment);
  },
} satisfies Theme;
