/** @type {import('stylelint').Config} */
export default {
  plugins: ['stylelint-scss', 'stylelint-prettier'],
  extends: ['stylelint-config-recess-order', 'stylelint-config-recommended-scss'],
  rules: {
    'no-empty-source': null,
    'block-no-empty': null,
    'font-family-no-missing-generic-family-keyword': null,
    'no-descending-specificity': null,
    'selector-id-pattern': null,
    'color-function-notation': 'legacy',
    'property-no-unknown': [
      true,
      {
        ignoreProperties: ['initial-scale'],
      },
    ],
    'selector-pseudo-element-colon-notation': 'double',
    'rule-empty-line-before': [
      'always',
      {
        except: ['after-single-line-comment', 'first-nested'],
        ignore: ['after-comment'],
      },
    ],
    'at-rule-empty-line-before': [
      'always',
      {
        except: ['blockless-after-same-name-blockless', 'first-nested'],
        ignore: ['after-comment'],
        ignoreAtRules: ['if', 'else'],
      },
    ],
    'scss/selector-no-union-class-name': true,
    'scss/no-global-function-names': null,
  },
};
