import { runCleanUp } from '@cli/commands/clean-up';
import { runImageMin } from '@cli/commands/image-min';
import { runStaticCopy } from '@cli/commands/static-copy';
import { runSvgSprite } from '@cli/commands/svg-sprite';
import { applyMode, type ModeOptions, resolveMode } from '@cli/context';
import { resolveWatchTasks, startWatch, watchTasks } from '@cli/watch';
import { Command } from 'commander';

type Task = 'clean' | 'copy' | 'img' | 'svg';
const runTasks = ['clean', 'copy', 'img', 'svg'] as const satisfies readonly Task[];

const isTask = (value: string): value is Task => {
  return runTasks.includes(value as Task);
};

const resolveRunTasks = (values: string[]): Task[] => {
  if (values.length === 0) return [...runTasks];

  const invalidTasks = values.filter((value) => !isTask(value));
  if (invalidTasks.length > 0) {
    throw new Error(`Unknown task: ${invalidTasks.join(', ')}`);
  }

  return values.filter((value): value is Task => isTask(value));
};

const modeOption = (command: Command) =>
  command
    .option('-d, --develop', 'Use development mode')
    .option('-p, --production', 'Use production mode');

const runTask = async (task: Task, mode: 'development' | 'production', files?: string[]) => {
  switch (task) {
    case 'clean': {
      await runCleanUp(mode);
      break;
    }
    case 'copy': {
      await runStaticCopy(files && files.length > 0 ? { mode, targets: files } : { mode });
      break;
    }
    case 'img': {
      await runImageMin(files && files.length > 0 ? files : undefined);
      break;
    }
    case 'svg': {
      await runSvgSprite(files && files.length > 0 ? files : undefined);
      break;
    }
  }
};

const main = async () => {
  const program = new Command();
  program.name('cli');

  modeOption(program.command('clean').description('Clean generated files.')).action(
    async (options: ModeOptions) => {
      const mode = applyMode(resolveMode(options));
      await runCleanUp(mode);
    },
  );

  modeOption(program.command('copy [files...]').description('Copy static assets.')).action(
    async (files: string[], options: ModeOptions) => {
      const mode = applyMode(resolveMode(options));
      await runStaticCopy(files.length > 0 ? { mode, targets: files } : { mode });
    },
  );

  modeOption(program.command('img [files...]').description('Optimize images.')).action(
    async (files: string[], options: ModeOptions) => {
      applyMode(resolveMode(options));
      await runImageMin(files.length > 0 ? files : undefined);
    },
  );

  modeOption(program.command('svg [files...]').description('Generate SVG sprite.')).action(
    async (files: string[], options: ModeOptions) => {
      applyMode(resolveMode(options));
      await runSvgSprite(files.length > 0 ? files : undefined);
    },
  );

  modeOption(
    program
      .command('run [tasks...]')
      .description(`Run tasks once. Available: ${runTasks.join(', ')}`),
  ).action(async (tasks: string[], options: ModeOptions) => {
    const mode = applyMode(resolveMode(options));

    for (const task of resolveRunTasks(tasks)) {
      await runTask(task, mode);
    }
  });

  modeOption(
    program
      .command('watch [tasks...]')
      .description(`Watch tasks. Available: ${watchTasks.join(', ')}`)
      .option('--no-initial', 'Skip initial run'),
  ).action(async (tasks: string[], options: ModeOptions & { initial: boolean }) => {
    const mode = applyMode(resolveMode(options, 'development'));
    await startWatch({
      initialRun: options.initial,
      mode,
      tasks: resolveWatchTasks(tasks),
    });
  });

  await program.parseAsync();
};

try {
  await main();
} catch (error) {
  console.trace(error);
  process.exitCode = 1;
}
