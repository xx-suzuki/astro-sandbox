import { beforeEach, describe, expect, it, vi } from 'vitest';

const syncMock = vi.fn();
const writeFileMock = vi.fn();
const readFileSyncMock = vi.fn();
const mkdirSyncMock = vi.fn();
const writeFileSyncMock = vi.fn();
const createFolderMock = vi.fn();
const consoleExistMock = vi.fn();
const consoleGenerateMock = vi.fn();
const optimizeMock = vi.fn();
const addMock = vi.fn();
const compileAsyncMock = vi.fn();

function SpriteMock() {
  return {
    add: addMock,
    compileAsync: compileAsyncMock,
  };
}

const spriteCtorMock = vi.fn(function (options?: unknown) {
  void options;
  return SpriteMock();
});

vi.mock('fast-glob', () => ({
  default: {
    sync: syncMock,
  },
}));

vi.mock('fs-extra', () => ({
  default: {
    mkdirSync: mkdirSyncMock,
    readFileSync: readFileSyncMock,
    writeFile: writeFileMock,
    writeFileSync: writeFileSyncMock,
  },
}));

vi.mock('svg-sprite', () => ({
  default: spriteCtorMock,
}));

vi.mock('svgo', () => ({
  optimize: optimizeMock,
}));

vi.mock('@scripts-node/helper/utils', () => ({
  createFolder: createFolderMock,
}));

vi.mock('@scripts-node/helper/drop-console', () => ({
  consoleExist: consoleExistMock,
  consoleGenerate: consoleGenerateMock,
}));

vi.mock('@root/project.config', () => ({
  svgSprite: {
    base: 'src/assets/svg-sprite',
    files: 'src/assets/svg-sprite/*.svg',
    outDir: '.tmp/assets/images',
    outName: 'sprite',
    scssPath: 'src/styles/setting/variable/_svg.scss',
    typesPath: 'src/types/svg-sprite.ts',
  },
}));

describe('svg-sprite', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    syncMock.mockReturnValue([]);
    writeFileMock.mockImplementation(async () => 'ok');
    readFileSyncMock.mockReturnValue('<svg xmlns="http://www.w3.org/2000/svg"></svg>');
    optimizeMock.mockReturnValue({ data: '<svg></svg>' });
    compileAsyncMock.mockResolvedValue({
      result: {
        symbol: {
          sprite: {
            contents: '<svg />',
            path: '.tmp/assets/images/sprite.svg',
          },
        },
      },
    });
  });

  it('runSvgSprite => no files', async () => {
    const { runSvgSprite } = await import('@scripts-node/commands/svg-sprite');
    await runSvgSprite();

    expect(consoleExistMock).toHaveBeenCalledWith('SVG');
  });

  it('runSvgSprite => keeps generated files when no svg exists', async () => {
    const { runSvgSprite } = await import('@scripts-node/commands/svg-sprite');
    await runSvgSprite();

    expect(writeFileMock).not.toHaveBeenCalled();
    expect(writeFileSyncMock).not.toHaveBeenCalled();
  });

  it('runSvgSprite => generate sprite, types and scss', async () => {
    syncMock.mockReturnValue(['src/assets/svg-sprite/home icon.svg']);
    const { runSvgSprite } = await import('@scripts-node/commands/svg-sprite');
    await runSvgSprite();

    expect(spriteCtorMock).toHaveBeenCalledTimes(1);
    expect(addMock).toHaveBeenCalledTimes(1);
    expect(writeFileSyncMock).toHaveBeenCalled();
    expect(createFolderMock).toHaveBeenCalled();
    expect(consoleGenerateMock).toHaveBeenCalledTimes(1);
  });

  it('runSvgSprite => sorts generated union types naturally', async () => {
    syncMock.mockReturnValue([
      'src/assets/svg-sprite/logo-tagline.svg',
      'src/assets/svg-sprite/icon10.svg',
      'src/assets/svg-sprite/logo.svg',
      'src/assets/svg-sprite/icon2.svg',
    ]);
    const { runSvgSprite } = await import('@scripts-node/commands/svg-sprite');
    await runSvgSprite();

    expect(writeFileMock).toHaveBeenCalledWith(
      expect.stringContaining('src/types/svg-sprite.ts'),
      "// prettier-ignore\nexport type SvgSpriteNames = 'icon2' | 'icon10' | 'logo' | 'logo-tagline';\n",
      'utf8',
    );
  });

  it('runSvgSprite => transform callback and custom plugin work', async () => {
    syncMock.mockReturnValue(['src/assets/svg-sprite/icon.svg']);
    const { runSvgSprite } = await import('@scripts-node/commands/svg-sprite');
    await runSvgSprite();

    const passedOptions = spriteCtorMock.mock.calls[0]?.[0] as
      | undefined
      | {
          svg?: { transform?: ((svg: string) => string)[] };
        };
    const transform = passedOptions?.svg?.transform?.[0] as (svg: string) => string;
    const transformed = transform('<svg></svg>');
    expect(transformed).toBe('<svg></svg>');

    const svgoConfigArg = optimizeMock.mock.calls[0]?.[1];
    const customPlugin = svgoConfigArg?.plugins?.find(
      (plugin: { name?: string }) => plugin?.name === 'removeSymbolXmlns',
    ) as {
      fn: () => {
        element: {
          enter: (node: { attributes: { xmlns?: string }; name: string }) => void;
        };
      };
    };
    const visitor = customPlugin.fn();
    const node = { attributes: { xmlns: 'http://www.w3.org/2000/svg' }, name: 'symbol' };
    visitor.element.enter(node);
    expect(node.attributes.xmlns).toBeUndefined();

    const untouched = { attributes: { xmlns: 'http://www.w3.org/2000/svg' }, name: 'g' };
    visitor.element.enter(untouched);
    expect(untouched.attributes.xmlns).toBe('http://www.w3.org/2000/svg');
  });
});
