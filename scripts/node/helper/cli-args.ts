import { type AppMode, resolveMode } from '@scripts-node/core/context';

export interface CommandCliArgs {
  initialRun: boolean;
  mode: AppMode;
  targets: string[];
  watch: boolean;
}

const flags = {
  develop: ['--develop', '-d'],
  initial: ['--initial'],
  noInitial: ['--no-initial'],
  production: ['--production', '-p'],
  watch: ['--watch', '-w'],
} as const;

const knownFlags = new Set<string>(Object.values(flags).flat());

const hasFlag = (argv: string[], name: keyof typeof flags): boolean =>
  argv.some((arg) => (flags[name] as readonly string[]).includes(arg));

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
  const isStateDevelop = hasFlag(argv, 'develop');
  const isStateProduction = hasFlag(argv, 'production');
  const isStateWatch = hasFlag(argv, 'watch');
  const isStateInitial = hasFlag(argv, 'initial');
  const isStateNoInitial = hasFlag(argv, 'noInitial');

  const unknownFlags = argv.filter((arg) => arg.startsWith('-') && !knownFlags.has(arg));
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
