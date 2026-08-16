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

  if (import.meta.env.DEV) {
    await import('@/foundation/parameter');
  }
};

const onLoad = async () => {
  console.log('load');
};
globalThis.addEventListener(Events.Load, onLoad);
onDOMContentLoaded();
