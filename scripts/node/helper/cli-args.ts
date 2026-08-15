import { type AppMode, resolveMode } from '@scripts-node/core/context';

export interface CommandCliArgs {
  initialRun: boolean;
  mode: AppMode;
  targets: string[];
  watch: boolean;
}

const isLongFlag = (arg: string, name: string): boolean => arg === `--${name}`;
const isShortFlag = (arg: string, name: string): boolean => arg === `-${name}`;

export const parseCommandCliArgs = (
  args: string[],
  {
    allowWatch,
    fallbackMode,
  }: {
    allowWatch: boolean;
    fallbackMode: AppMode;
  },
): CommandCliArgs => {
  const argv = args.filter((arg) => arg !== '--');
  const isStateDevelop = argv.some((arg) => isShortFlag(arg, 'd') || isLongFlag(arg, 'develop'));
  const isStateProduction = argv.some(
    (arg) => isShortFlag(arg, 'p') || isLongFlag(arg, 'production'),
  );
  const isStateWatch = argv.some((arg) => isShortFlag(arg, 'w') || isLongFlag(arg, 'watch'));
  const isStateInitial = argv.some((arg) => isLongFlag(arg, 'initial'));
  const isStateNoInitial = argv.some((arg) => isLongFlag(arg, 'no-initial'));

  const unknownFlags = argv.filter(
    (arg) =>
      arg.startsWith('-') &&
      ![
        '--develop',
        '--initial',
        '--no-initial',
        '--production',
        '--watch',
        '-d',
        '-p',
        '-w',
      ].includes(arg),
  );
  if (unknownFlags.length > 0) {
    throw new Error(`Unknown option: ${unknownFlags.join(', ')}`);
  }

  if (isStateInitial && isStateNoInitial) {
    throw new Error('Use either --initial or --no-initial.');
  }

  if (isStateWatch && !allowWatch) {
    throw new Error('This command does not support --watch.');
  }

  const mode = resolveMode(
    { develop: isStateDevelop, production: isStateProduction },
    isStateWatch ? 'development' : fallbackMode,
  );

  const targets = argv.filter((arg) => !arg.startsWith('-'));

  return {
    initialRun: isStateWatch ? isStateInitial : !isStateNoInitial,
    mode,
    targets,
    watch: isStateWatch,
  };
};
