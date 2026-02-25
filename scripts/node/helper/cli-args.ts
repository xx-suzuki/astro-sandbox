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
  const stateDevelop = argv.some((arg) => isShortFlag(arg, 'd') || isLongFlag(arg, 'develop'));
  const stateProduction = argv.some(
    (arg) => isShortFlag(arg, 'p') || isLongFlag(arg, 'production'),
  );
  const stateWatch = argv.some((arg) => isShortFlag(arg, 'w') || isLongFlag(arg, 'watch'));
  const stateInitial = argv.some((arg) => isLongFlag(arg, 'initial'));
  const stateNoInitial = argv.some((arg) => isLongFlag(arg, 'no-initial'));

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

  if (stateInitial && stateNoInitial) {
    throw new Error('Use either --initial or --no-initial.');
  }

  if (stateWatch && !allowWatch) {
    throw new Error('This command does not support --watch.');
  }

  const mode = resolveMode(
    { develop: stateDevelop, production: stateProduction },
    stateWatch ? 'development' : fallbackMode,
  );

  const targets = argv.filter((arg) => !arg.startsWith('-'));

  return {
    initialRun: stateWatch ? stateInitial : !stateNoInitial,
    mode,
    targets,
    watch: stateWatch,
  };
};
