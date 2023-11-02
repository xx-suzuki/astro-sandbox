import { Env } from '@/constants/env';
import { Events } from '@/constants/events';
import SetBrowser from '@/foundation/browser';
import SetLayout from '@/foundation/layout';
import SetParam from '@/foundation/parameter';

/** Init */
const Init = async () => {
  /** Foundation */
  SetLayout();
  SetBrowser();
  SetParam();

  /** development */
  if (Env.isDev) {
    const Stats = (await import('@/foundation/stats')).default;
    new Stats().start();
  }
};

if (document.readyState !== 'loading') {
  Init();
} else {
  document.addEventListener(Events.Load, Init, false);
}
