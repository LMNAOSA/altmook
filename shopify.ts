import { useCallback, useEffect, useState } from 'react';

/**
 * Shopify checkout for the Mooka Boys site.
 *
 * The site stays the shop window. Shopify supplies the live price and stock for each product,
 * and hosts the checkout. Pressing Acquire makes a one-item cart on Shopify and sends the
 * visitor to Shopify's own checkout page, where payment happens.
 *
 * A product on the site is matched to a product in Shopify by its handle (the last part of its
 * Shopify web address, for example "the-cobra-cuff"). Until a product with that handle exists
 * in Shopify, its button says "Opening soon" and does nothing. Nothing needs changing in the
 * site when a product is added in Shopify: it goes live on its own.
 *
 * Shopify's Storefront API needs a public access token while the store's Online Store channel is
 * locked (the password page is on). Without one it answers "Online Store channel is locked", and
 * every button here stays on "Opening soon". Create the token in Shopify (Headless channel), then
 * add it in Vercel as VITE_SHOPIFY_STOREFRONT_TOKEN and redeploy. It is a public token, built to
 * sit in a web page. Never use a private one.
 */

const STORE_DOMAIN = import.meta.env.VITE_SHOPIFY_STORE_DOMAIN || 'ichdm6-wk.myshopify.com';
const STOREFRONT_TOKEN = import.meta.env.VITE_SHOPIFY_STOREFRONT_TOKEN || '';
const API_VERSION = '2026-10';
const ENDPOINT = `https://${STORE_DOMAIN}/api/${API_VERSION}/graphql.json`;

export type LiveVariant = {
  id: string;
  /** "Default Title" for a product with no options, otherwise the option, e.g. "M" */
  title: string;
  available: boolean;
  price: number;
  currency: string;
};

export type LiveProduct = {
  handle: string;
  title: string;
  variants: LiveVariant[];
};

type Catalogue = Record<string, LiveProduct>;

// ---------------------------------------------------------------------------------------------
// Talking to Shopify
// ---------------------------------------------------------------------------------------------

async function storefront<T>(query: string, variables: Record<string, unknown>): Promise<T> {
  const res = await fetch(ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      ...(STOREFRONT_TOKEN ? { 'X-Shopify-Storefront-Access-Token': STOREFRONT_TOKEN } : {}),
    },
    body: JSON.stringify({ query, variables }),
  });
  if (!res.ok) throw new Error(`Shopify responded ${res.status}`);
  const json = await res.json();
  if (json.errors?.length) throw new Error(json.errors[0]?.message || 'Shopify returned an error');
  return json.data as T;
}

// One aliased lookup per handle, so a page asks for exactly the products it shows. Kept small on
// purpose: without a token Shopify caps a query's cost, and 12 variants is plenty for a shirt.
function buildProductsQuery(count: number): string {
  const vars = Array.from({ length: count }, (_, i) => `$h${i}: String!`).join(', ');
  const fields = Array.from({ length: count }, (_, i) => `  p${i}: product(handle: $h${i}) { ...ProductFields }`).join('\n');
  return `query Products(${vars}) {
${fields}
}
fragment ProductFields on Product {
  handle
  title
  variants(first: 12) {
    nodes {
      id
      title
      availableForSale
      price {
        amount
        currencyCode
      }
    }
  }
}`;
}

const BUY_NOW_MUTATION = `mutation BuyNow($lines: [CartLineInput!]!) {
  cartCreate(input: { lines: $lines }) {
    cart {
      checkoutUrl
    }
    userErrors {
      field
      message
    }
  }
}`;

type RawProduct = {
  handle: string;
  title: string;
  variants: {
    nodes: { id: string; title: string; availableForSale: boolean; price: { amount: string; currencyCode: string } }[];
  };
} | null;

async function fetchProducts(handles: string[]): Promise<Catalogue> {
  const variables: Record<string, string> = {};
  handles.forEach((h, i) => { variables[`h${i}`] = h; });
  const data = await storefront<Record<string, RawProduct>>(buildProductsQuery(handles.length), variables);

  const catalogue: Catalogue = {};
  handles.forEach((handle, i) => {
    const raw = data[`p${i}`];
    if (!raw || !raw.variants.nodes.length) return; // not in Shopify (yet)
    catalogue[handle] = {
      handle: raw.handle,
      title: raw.title,
      variants: raw.variants.nodes.map((v) => ({
        id: v.id,
        title: v.title,
        available: v.availableForSale,
        price: Number(v.price.amount),
        currency: v.price.currencyCode,
      })),
    };
  });
  return catalogue;
}

// Each distinct set of handles is fetched once per visit, however many components ask.
const requests = new Map<string, Promise<Catalogue>>();
function loadProducts(handles: string[]): Promise<Catalogue> {
  const key = handles.join('|');
  let request = requests.get(key);
  if (!request) {
    request = fetchProducts(handles).catch((err) => {
      requests.delete(key); // a failure is not remembered, so the next visit tries again
      throw err;
    });
    requests.set(key, request);
  }
  return request;
}

/** Makes a one-item cart on Shopify and returns the address of its checkout page. */
async function startCheckout(variantId: string, quantity = 1): Promise<string> {
  const data = await storefront<{
    cartCreate: { cart: { checkoutUrl: string } | null; userErrors: { message: string }[] };
  }>(BUY_NOW_MUTATION, { lines: [{ merchandiseId: variantId, quantity }] });

  const { cart, userErrors } = data.cartCreate;
  if (userErrors?.length) throw new Error(userErrors[0].message);
  if (!cart?.checkoutUrl) throw new Error('Shopify did not return a checkout link');
  return cart.checkoutUrl;
}

// ---------------------------------------------------------------------------------------------
// For the pages
// ---------------------------------------------------------------------------------------------

const NOTHING: Catalogue = {};

/**
 * Live Shopify data for the products on a page, keyed by handle. Products Shopify does not
 * have are simply missing from `catalogue`. If Shopify cannot be reached, `catalogue` is empty
 * and `loaded` still becomes true, so the page falls back to its own sample details.
 */
export function useCatalogue(handles: (string | undefined)[]): { catalogue: Catalogue; loaded: boolean } {
  const key = handles.filter((h): h is string => Boolean(h)).join('|');
  const [result, setResult] = useState<{ key: string; catalogue: Catalogue } | null>(null);

  useEffect(() => {
    if (!key) {
      setResult({ key, catalogue: NOTHING });
      return;
    }
    let cancelled = false;
    loadProducts(key.split('|')).then(
      (catalogue) => { if (!cancelled) setResult({ key, catalogue }); },
      () => { if (!cancelled) setResult({ key, catalogue: NOTHING }); },
    );
    return () => { cancelled = true; };
  }, [key]);

  const loaded = result?.key === key;
  return { catalogue: loaded ? result!.catalogue : NOTHING, loaded };
}

export type Acquire = {
  /** What the button should say */
  label: string;
  /** True while there is nothing to buy, or while checkout is opening */
  disabled: boolean;
  status: 'loading' | 'unavailable' | 'soldout' | 'ready' | 'working';
  /** Live price of the chosen variant, or null when Shopify has none */
  price: number | null;
  /** Sizes or other options. Only worth showing when there is more than one. */
  variants: LiveVariant[];
  variantId: string | null;
  selectVariant: (id: string) => void;
  /** Set when checkout could not be opened. Show it under the button. */
  error: string | null;
  acquire: () => void;
};

/** The state and behaviour of an Acquire button for one product. */
export function useAcquire(product: LiveProduct | undefined, loaded: boolean, readyLabel = 'Acquire'): Acquire {
  const variants = product?.variants ?? [];
  const [chosenId, setChosenId] = useState<string | null>(null);
  const variant = variants.find((v) => v.id === chosenId) ?? variants.find((v) => v.available) ?? variants[0];

  const [working, setWorking] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Pressing Back from Shopify's checkout can restore this page exactly as it was left,
  // mid-"opening checkout". Un-stick the button when that happens.
  useEffect(() => {
    const onShow = (e: PageTransitionEvent) => { if (e.persisted) setWorking(false); };
    window.addEventListener('pageshow', onShow);
    return () => window.removeEventListener('pageshow', onShow);
  }, []);

  const acquire = useCallback(async () => {
    if (!variant || !variant.available || working) return;
    setWorking(true);
    setError(null);
    try {
      window.location.assign(await startCheckout(variant.id));
    } catch {
      setWorking(false);
      setError('Checkout could not be opened. Please try again.');
    }
  }, [variant, working]);

  let status: Acquire['status'];
  let label = readyLabel;
  if (!loaded) status = 'loading';
  else if (!variant) { status = 'unavailable'; label = 'Opening soon'; }
  else if (working) { status = 'working'; label = 'Opening checkout…'; }
  else if (!variant.available) { status = 'soldout'; label = 'Sold out'; }
  else status = 'ready';

  return {
    label,
    disabled: status !== 'ready',
    status,
    price: variant ? variant.price : null,
    variants,
    variantId: variant ? variant.id : null,
    selectVariant: setChosenId,
    error,
    acquire,
  };
}

/** 45000 -> "45,000"; 49.5 -> "49.50" */
export function formatPrice(amount: number): string {
  return amount.toLocaleString('en-AU', {
    minimumFractionDigits: Number.isInteger(amount) ? 0 : 2,
    maximumFractionDigits: 2,
  });
}
