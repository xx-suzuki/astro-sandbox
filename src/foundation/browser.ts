class Browser {
  public device = '';
  public browser = '';
  public isIos = false;
  public isMobile = false;
  public isTouch = false;
  public ua: string = navigator.userAgent.toLowerCase();

  constructor() {
    this.setDevice();
    this.setBrowsert();
    this.addClass();
  }

  private setDevice() {
    if (this.ua.includes('iphone')) {
      this.device = 'iphone';
    } else if (this.ua.includes('ipad')) {
      this.device = 'ipad';
    } else if (this.ua.includes('android')) {
      this.device = 'android';
    } else if (this.ua.includes('win')) {
      this.device = 'windows';
    } else if (this.ua.includes('mac')) {
      this.device = 'mac';
    } else {
      this.device = 'unknown';
    }

    this.isIos = this.device === 'iphone' || this.device === 'iPad';
    this.isMobile = this.isIos || this.device === 'android';
    this.isTouch = 'ontouchstart' in window;
  }

  private setBrowsert() {
    if (this.ua.includes('trident/7') || this.ua.includes('msie')) {
      this.browser = 'ie11';
    } else if (this.ua.includes('edge')) {
      this.browser = 'edge';
    } else if (this.ua.includes('chrome')) {
      this.browser = 'chrome';
    } else if (this.ua.includes('safari')) {
      this.browser = 'safari';
    } else if (this.ua.includes('firefox')) {
      this.browser = 'firefox';
    } else {
      this.browser = 'unknown';
    }
  }

  private addClass() {
    const mobileCls = this.isMobile ? 'mobile' : 'desktop';
    const touchCls = this.isTouch ? 'touch' : 'mouse';

    const cls = [this.browser, this.device, mobileCls, touchCls];
    document.documentElement.classList.add(...cls);
  }
}

export const browser = new Browser();
