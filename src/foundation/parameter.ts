import type { FpsGraphBladeApi } from '@tweakpane/plugin-essentials';

import * as EssentialsPlugin from '@tweakpane/plugin-essentials';
import { Pane } from 'tweakpane';

import { Env } from '@/constants/env';
import { decimalPart } from '@/helper/math';

const html = document.documentElement;
const { body } = document;
// const easeOptions = {
//   easeInOut: 'power2.inOut',
//   easeIn: 'power2.in',
//   easeOut: 'power2.out',
//   linear: 'none',
// };

class Parameter {
  // ----------------------------------
  // Style
  public PARAMS = {
    base: 0.35,
    fast: 0.25,
    loose: 1.2,
    slow: 0.6,
  };

  get getPane() {
    return this.pane;
  }
  private layerElm: HTMLDivElement | undefined = undefined;

  private pane: Pane | undefined = undefined;

  constructor() {
    this.updateStyleVariables();
    if (Env.mode !== 'production') {
      this.bindPane();
      this.bindStyleVariables();
    }
  }

  private bindPane() {
    // ----------------------------------
    // Create instance
    this.layerElm = Object.assign(document.createElement('div'), {
      id: 'float-layer',
      style: `
          width: 300px;
          position: fixed;
          bottom: 20px;
          left: 20px;
          z-index: 100;
        `,
    });
    this.pane = new Pane({
      container: this.layerElm,
      expanded: false, // 初期表示
      title: 'Debug',
    });
    this.pane.registerPlugin(EssentialsPlugin);

    // ----------------------------------
    // FPS monitor
    const fpsGraph = this.pane.addBlade({
      index: -1,
      label: 'FPS',
      lineCount: 2,
      view: 'fpsgraph',
    }) as FpsGraphBladeApi;
    const render = () => {
      fpsGraph.begin();
      fpsGraph.end();
      requestAnimationFrame(render);
    };
    render();

    // ----------------------------------
    // insert panel
    body.append(this.layerElm);
  }

  private bindStyleVariables() {
    if (!this.pane) {
      return;
    }

    const folder = this.pane.addFolder({
      title: 'CSS Duration',
    });

    folder
      .addBinding(this.PARAMS, 'fast', {
        label: 'Fast',
        max: 3,
        min: 0.15,
        step: 0.05,
      })
      .on('change', (v) => {
        this.PARAMS.fast = decimalPart(Number(v.value), 3);
      });

    folder
      .addBinding(this.PARAMS, 'base', {
        label: 'Base',
        max: 3,
        min: 0.15,
        step: 0.05,
      })
      .on('change', (v) => {
        this.PARAMS.base = decimalPart(Number(v.value), 3);
      });

    folder
      .addBinding(this.PARAMS, 'slow', {
        label: 'Slow',
        max: 3,
        min: 0.15,
        step: 0.05,
      })
      .on('change', (v) => {
        this.PARAMS.slow = decimalPart(Number(v.value), 3);
      });

    folder
      .addBinding(this.PARAMS, 'loose', {
        label: 'Loose',
        max: 3,
        min: 0.15,
        step: 0.05,
      })
      .on('change', (v) => {
        this.PARAMS.loose = decimalPart(Number(v.value), 3);
      });

    folder.on('change', () => {
      this.updateStyleVariables();
    });
  }

  private updateStyleVariables() {
    html.style.setProperty('--duration-fast', `${this.PARAMS.fast}s`);
    html.style.setProperty('--duration-base', `${this.PARAMS.base}s`);
    html.style.setProperty('--duration-slow', `${this.PARAMS.slow}s`);
    html.style.setProperty('--duration-loose', `${this.PARAMS.loose}s`);
  }
}

export const parameter = new Parameter();
