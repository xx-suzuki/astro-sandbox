// eslint-disable-next-line no-unused-vars
interface Window {
  APP: {
    Layout: {
      breakpointSP: number;
      breakpointTAB: number;
      isSP: boolean;
      isTAB: boolean;
      isPC: boolean;
      documentWidth: number;
      documentHeight: number;
      windowWidth: number;
      windowHeight: number;
      scrollBarWidth: number;
    };
    Browser: {
      device: string;
      browser: string;
      isIos: boolean;
      isMobile: boolean;
      isTouch: boolean;
      ua: string;
    };
    Param: {
      durationX: number;
      delayX: number;
      easeX: gsap.EaseString;
      durationY: number;
      delayY: number;
      easeY: gsap.EaseString;
      plugDurationEnter: number;
      plugDurationLeave: number;
      plugDelayEnter: number;
      plugDelayLeave: number;
    };
  };
}
