# Astro development sandbox

## About

簡易的な静的サイト用の開発環境です。  
CMS等にアップロードや差分納品しなければならいケースを想定して、ファイルのハッシュ化をしない構成にしてます…🫠

## Tech Stack

- [Astro](https://astro.build/)
- [Vite](https://vitejs.dev/)
- [ESLint](https://github.com/eslint/eslint)
- [Stylelint](https://stylelint.io/)
- [Prettier](https://prettier.io/)
- [PLOP](https://plopjs.com/documentation/)
- CSS
  - [SASS](https://sass-lang.com/) 
  - [FLOCSS](https://github.com/hiloki/flocss)
  - [BEM](http://getbem.com/)
- JavaScript
  - [TypeScript](https://www.typescriptlang.org/)

## Getting Started

### Install dependencies

```bash
npm ci
```

### Start local server

```bash
npm run dev
```

## Directory

```bash
.
├── plop/               # Contains template files for Plop
├── src/
│   ├── abstracts/      # TypeScript abstract modules
│   ├── assets/         # Assets such as images, SVGs, etc.
│   ├── components/     # Astro components
│   ├── constants/      # Constants
│   ├── foundation/     # Base processing for TypeScript
│   ├── globals/        # TypeScript processing used throughout the site
│   ├── helper/         # Helper functions used in TypeScript and Astro
│   ├── layouts/        # Astro components for page structure
│   ├── pages/          # Each page generated by Astro
│   ├── projects/       # Astro components managing project-specific patterns
│   ├── styles/         # SCSS files
│   └── types/          # Type definitions
├── static/             # Static assets
├── tasks/              # Processing for npm scripts
└── project.config.ts   # Common project settings
```

## Commands

| command | detail                                             |
| ------- | -------------------------------------------------- |
| `dev`   | Development mode                                   |
| `build` | Static site generate                               |
| `fix`   | ESLint & Stylelint                                 |
| `plop`  | Create template files                              |
| `w3c`   | Output of W3C Validate report (Please after build) |
| `icon`  | Generate SVG data for font-awesome.                |

## Others

### Husky & lintstaged

Gitコミット時に`eslint`と`stylelint`、`prettier`が実行されます。

### SVG to Sprite

SVGからSpriteデータを生成します。  
対象データは下記に格納してください。  
`/src/assets/svg-sprite/*.svg`

### Font Awesome
`npm run icon` を実行し、Font Awesomeのicon名（`house`など）を入力すると、jsonデータからSVGデータを生成します。  
アイコン名は下記から探してください。  
https://fontawesome.com/

また、有料ユーザーは`/tasks/font-awesome/icon-families.json`を有料版のjsonに差し替えると使用できます。

### W3C Validate

`build`後に`w3c`を行うことで、W3Cバリデーターのレポート`report-w3c.txt`が出力されます。  
必要に応じてhtml構文の確認と修正を行ってください。
