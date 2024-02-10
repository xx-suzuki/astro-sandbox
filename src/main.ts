import { Env } from '@/constants/env';
import '@/foundation/layout';
import '@/foundation/browser';
import '@/styles/styles.scss';

/** Init */
async function Init() {
  /** Foundation */

  if (Env.isDev) {
    await import('@/foundation/parameter');
  }
}

void Init();
