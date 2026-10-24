export type AppMode = 'development' | 'production';

export interface ModeOptions {
  develop?: boolean;
  production?: boolean;
}

export const resolveMode = (options: ModeOptions, fallback: AppMode = 'production'): AppMode => {
  if (options.develop && options.production) {
    throw new Error('Use either --develop or --production.');
  }

  if (options.develop) return 'development';
  return options.production ? 'production' : fallback;
};

export const applyMode = (mode: AppMode): AppMode => {
  process.env.NODE_ENV = mode;
  return mode;
};
