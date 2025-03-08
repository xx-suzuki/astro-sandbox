import * as EssentialsPlugin from '@tweakpane/plugin-essentials';
import type { FpsGraphBladeApi } from '@tweakpane/plugin-essentials';
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
    fast: 0.25,
    base: 0.35,
    slow: 0.6,
    loose: 1.2,
  };

  private layerElm: HTMLDivElement | null = null;
  private pane: Pane | null = null;

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
      title: 'Debug',
      container: this.layerElm,
      expanded: false, // 初期表示
    });
    this.pane.registerPlugin(EssentialsPlugin);

    // ----------------------------------
    // FPS monitor
    const fpsGraph = this.pane.addBlade({
      view: 'fpsgraph',
      label: 'FPS',
      lineCount: 2,
      index: -1,
    }) as FpsGraphBladeApi;
    const render = () => {
      fpsGraph.begin();
      fpsGraph.end();
      requestAnimationFrame(render);
    };
    render();

    // ----------------------------------
    // insert panel
    body.appendChild(this.layerElm);
  }

  get getPane() {
    return this.pane;
  }

  private updateStyleVariables() {
    html.style.setProperty('--duration-fast', `${this.PARAMS.fast}s`);
    html.style.setProperty('--duration-base', `${this.PARAMS.base}s`);
    html.style.setProperty('--duration-slow', `${this.PARAMS.slow}s`);
    html.style.setProperty('--duration-loose', `${this.PARAMS.loose}s`);
  }

  private bindStyleVariables() {
    if (this.pane) {
      const folder = this.pane.addFolder({
        title: 'CSS Duration',
      });

      folder
        .addBinding(this.PARAMS, 'fast', {
          label: 'Fast',
          min: 0.15,
          max: 3.0,
          step: 0.05,
        })
        .on('change', (v) => {
          this.PARAMS.fast = decimalPart(Number(v.value), 3);
        });

      folder
        .addBinding(this.PARAMS, 'base', {
          label: 'Base',
          min: 0.15,
          max: 3.0,
          step: 0.05,
        })
        .on('change', (v) => {
          this.PARAMS.base = decimalPart(Number(v.value), 3);
        });

      folder
        .addBinding(this.PARAMS, 'slow', {
          label: 'Slow',
          min: 0.15,
          max: 3.0,
          step: 0.05,
        })
        .on('change', (v) => {
          this.PARAMS.slow = decimalPart(Number(v.value), 3);
        });

      folder
        .addBinding(this.PARAMS, 'loose', {
          label: 'Loose',
          min: 0.15,
          max: 3.0,
          step: 0.05,
        })
        .on('change', (v) => {
          this.PARAMS.loose = decimalPart(Number(v.value), 3);
        });

      folder.on('change', () => {
        this.updateStyleVariables();
      });
    }
  }
}

export const parameter = new Parameter();
