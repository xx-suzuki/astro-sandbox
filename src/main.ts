// import { Env } from '@/constants/env';
import { Events } from '@/constants/events';
import '@/foundation/layout';
import '@/foundation/browser';
import '@/foundation/parameter';

import '@/styles/styles.scss';

/** Init */
const Init = async () => {
  /** Foundation */
};

if (document.readyState !== 'loading') {
  Init();
} else {
  document.addEventListener(Events.Load, Init, false);
}
