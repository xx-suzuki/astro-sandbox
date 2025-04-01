import { MediaQueryList as MQL } from '@/constants/media-query-list';
import { decimalPart } from '@/helper/math';
import { debounce } from '@/helper/utils';
import { breakpoints, designSize } from '@root/project.config';

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
    this.handleResize = this.handleResize.bind(this);
    this.handleResize();
    const ro = new ResizeObserver(debounce(this.handleResize, 100));
    ro.observe(body);
  }

  handleResize(): void {
    this.isSP = MQL.Sp.matches;
    this.isTAB = MQL.Tab.matches;
    this.isPC = MQL.Pc.matches;
    this.documentWidth = body.clientWidth;
    this.documentHeight = body.clientHeight;
    this.windowWidth = window.innerWidth;
    this.windowHeight = window.innerHeight;

    // ----------------------------------
    // スクロールバー
    this.scrollBarWidth = this.windowWidth - this.documentWidth;
    document.documentElement.style.setProperty(
      '--scroll-bar',
      `${decimalPart(this.scrollBarWidth, 2)}px`,
    );

    // ----------------------------------
    // ルートサイズ
    const sizeRate =
      this.windowWidth > breakpoints.sp
        ? Math.min(this.documentWidth / designSize.pc, 1)
        : this.documentWidth / designSize.sp;
    document.documentElement.style.setProperty('--size-rate', `${decimalPart(sizeRate, 3)}`);
  }
}

export const layout = new Layout();
