import { MediaQueryList as MQL } from '@/constants/media-query-list';
import { decimalPart } from '@/helper/math';

const { body } = document;

class Layout {
  public isSP = false;
  public isTAB = false;
  public isPC = false;
  public documentWidth = 0;
  public documentHeight = 0;
  public windowWidth = 0;
  public windowHeight = 0;
  public scrollBarWidth = 0;

  constructor() {
    this.handleResize();
    const ro = new ResizeObserver(() => this.handleResize());
    ro.observe(body);
  }

  handleResize(): void {
    this.isSP = MQL.Sp.matches;
    this.isTAB = MQL.Pc.matches;
    this.isPC = !this.isSP && !this.isTAB;
    this.documentWidth = body.clientWidth;
    this.documentHeight = body.clientHeight;
    this.windowWidth = window.innerWidth;
    this.windowHeight = window.innerHeight;

    // ----------------------------------
    // スクロールバー無し
    const docW = this.documentWidth * 0.01;
    const docH = this.documentHeight * 0.01;
    document.documentElement.style.setProperty('--vw', `${decimalPart(docW, 2)}px`);
    document.documentElement.style.setProperty('--vh', `${decimalPart(docH, 2)}px`);

    // ----------------------------------
    // ウインドウサイズ（SPはメニュー拡大縮小で可変）
    const winW = this.windowWidth * 0.01;
    const winH = this.windowHeight * 0.01;
    document.documentElement.style.setProperty('--vw-win', `${decimalPart(winW, 2)}px`);
    document.documentElement.style.setProperty('--vh-win', `${decimalPart(winH, 2)}px`);

    // ----------------------------------
    // スクロールバー
    this.scrollBarWidth = (winW - docW) * 100;
    document.documentElement.style.setProperty(
      '--scroll-bar',
      `${decimalPart(this.scrollBarWidth, 2)}px`,
    );
  }
}

export const browser = new Layout();
