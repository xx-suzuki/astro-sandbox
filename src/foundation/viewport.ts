import { Events } from '@/constants/events';
import { browser } from '@/foundation/browser';

const html = document.documentElement;

class Viewport {
  private lastWidth = window.innerWidth;
  private maxHeight = window.innerHeight;

  constructor() {
    if (!browser.isWebView) return;

    this.handleResize = this.handleResize.bind(this);
    this.update();
    this.updateMin();
    globalThis.addEventListener(Events.Resize, this.handleResize);
  }

  private update(): void {
    html.style.setProperty('--fvh', `${this.maxHeight * 0.01}px`);
  }

  private updateMin(): void {
    html.style.setProperty('--fvh-min', `${window.innerHeight * 0.01}px`);
  }

  handleResize(): void {
    if (window.innerWidth !== this.lastWidth) {
      this.lastWidth = window.innerWidth;
      this.maxHeight = window.innerHeight;
      this.update();
      this.updateMin();
      return;
    }

    if (window.innerHeight <= this.maxHeight) {
      return;
    }

    this.maxHeight = window.innerHeight;
    this.update();
  }
}

export const viewport = new Viewport();
