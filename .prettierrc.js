const config = {
  proseWrap: 'always',
  semi: true,
  singleQuote: true,
  trailingComma: 'es5',
  arrowParens: 'always',
  importOrder: [
    '<THIRD_PARTY_MODULES>',
    '^@utils/(.*)$',
    '^@components/demos/(.*)$',
    '^@components/pages/(.*)$',
    '^@components/layouts/(.*)$',
    '^@components/elements/(.*)$',
    '^@components/ui/(.*)$',
    '^[./]',
  ],
  importOrderSeparation: true,
  plugins: ['@trivago/prettier-plugin-sort-imports'],
};

export default config;
