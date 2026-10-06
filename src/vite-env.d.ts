/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Your Shopify store's .myshopify.com address. Defaults to the Mooka Boys store. */
  readonly VITE_SHOPIFY_STORE_DOMAIN?: string;
  /** Public Storefront access token from Shopify's Headless channel. Needed while the store is locked. */
  readonly VITE_SHOPIFY_STOREFRONT_TOKEN?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
