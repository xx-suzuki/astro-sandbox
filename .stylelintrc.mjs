/* eslint unicorn/no-null: "off" */
/** @type {import('stylelint').Config} */
export default {
  extends: ['stylelint-config-recess-order', 'stylelint-config-recommended-scss'],
  plugins: ['stylelint-scss', 'stylelint-prettier'],
  rules: {
    'at-rule-empty-line-before': [
      'always',
      {
        except: ['blockless-after-same-name-blockless', 'first-nested'],
        ignore: ['after-comment'],
        ignoreAtRules: ['if', 'else'],
      },
    ],
    'block-no-empty': undefined,
    'color-function-notation': 'legacy',
    'font-family-no-missing-generic-family-keyword': null,
    'no-descending-specificity': null,
    'no-empty-source': null,
    'property-no-unknown': [
      true,
      {
        ignoreProperties: ['initial-scale'],
      },
    ],
    'rule-empty-line-before': [
      'always',
      {
        except: ['after-single-line-comment', 'first-nested'],
        ignore: ['after-comment'],
      },
    ],
    'scss/no-global-function-names': null,
    'scss/selector-no-union-class-name': true,
    'selector-id-pattern': null,
    'selector-pseudo-element-colon-notation': 'double',
  },
};
