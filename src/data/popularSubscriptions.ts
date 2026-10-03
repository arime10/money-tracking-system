export interface SubscriptionPreset {
  name: string;
  defaultAmount: number;
  color: string;
  icon: string;
  categoryId: string;
}

export const POPULAR_SUBSCRIPTIONS: SubscriptionPreset[] = [
  {
    name: 'Netflix',
    defaultAmount: 229.99,
    color: '#e50914',
    icon: 'Tv',
    categoryId: 'cat-eglence',
  },
  {
    name: 'Spotify Premium',
    defaultAmount: 59.99,
    color: '#1db954',
    icon: 'Music',
    categoryId: 'cat-eglence',
  },
  {
    name: 'YouTube Premium',
    defaultAmount: 79.99,
    color: '#ff0000',
    icon: 'PlaySquare',
    categoryId: 'cat-eglence',
  },
  {
    name: 'Apple (iCloud / Music / One)',
    defaultAmount: 99.99,
    color: '#000000',
    icon: 'Smartphone',
    categoryId: 'cat-eglence',
  },
  {
    name: 'Amazon Prime',
    defaultAmount: 39.00,
    color: '#00a8e1',
    icon: 'ShoppingBag',
    categoryId: 'cat-eglence',
  },
  {
    name: 'Disney+',
    defaultAmount: 164.90,
    color: '#113ccf',
    icon: 'Film',
    categoryId: 'cat-eglence',
  },
  {
    name: 'ChatGPT Plus',
    defaultAmount: 680.00,
    color: '#10a37f',
    icon: 'Bot',
    categoryId: 'cat-egitim',
  },
  {
    name: 'Exxen',
    defaultAmount: 180.00,
    color: '#fab818',
    icon: 'Tv',
    categoryId: 'cat-eglence',
  },
  {
    name: 'BluTV / Max',
    defaultAmount: 139.90,
    color: '#00adef',
    icon: 'Tv',
    categoryId: 'cat-eglence',
  },
  {
    name: 'Spor Salonu / Fitness',
    defaultAmount: 1200.00,
    color: '#f97316',
    icon: 'Dumbbell',
    categoryId: 'cat-saglik',
  },
];
