import { Env } from '@/constants/env';
import { Events } from '@/constants/events';
import '@/foundation/layout';
import '@/foundation/browser';
import '@/styles/styles.scss';

/**
Init
*/
const onDOMContentLoaded = async () => {
  /**
  Foundation
  */
  console.log('init');

  if (Env.isDev) {
    await import('@/foundation/parameter');
  }
};

const onLoad = async () => {
  console.log('load');
};
globalThis.addEventListener(Events.Load, onLoad);
onDOMContentLoaded();
