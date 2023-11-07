import * as EssentialsPlugin from '@tweakpane/plugin-essentials';
import type { FpsGraphBladeApi } from '@tweakpane/plugin-essentials';
import { Pane } from 'tweakpane';
import { Env } from '@/constants/env';

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
    opacity: {
      duration: {
        in: 0.7,
        out: 0.7,
      },
    },
    translate: {
      duration: {
        in: 0.5,
        out: 0.4,
      },
    },
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
          right: 20px;
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
    if (this.pane) return this.pane;
  }

  private updateStyleVariables() {
    html.style.setProperty(
      '--transition-duration-opacity-in',
      `${this.PARAMS.opacity.duration.in}s`,
    );
    html.style.setProperty(
      '--transition-duration-opacity-out',
      `${this.PARAMS.opacity.duration.out}s`,
    );
    html.style.setProperty(
      '--transition-duration-translate-in',
      `${this.PARAMS.translate.duration.in}s`,
    );
    html.style.setProperty(
      '--transition-duration-translate-out',
      `${this.PARAMS.translate.duration.out}s`,
    );
  }

  private bindStyleVariables() {
    const { opacity, translate } = this.PARAMS;
    if (this.pane) {
      const folder = this.pane.addFolder({
        title: 'CSS Variables',
      });

      folder
        .addBinding(opacity.duration, 'in', {
          label: 'Opacity (in)',
          min: 0.15,
          max: 3.0,
          step: 0.05,
        })
        .on('change', (v) => {
          opacity.duration.in = Number(v.value);
        });

      folder
        .addBinding(opacity.duration, 'out', {
          label: 'Opacity (out)',
          min: 0.15,
          max: 3.0,
          step: 0.05,
        })
        .on('change', (v) => {
          opacity.duration.out = Number(v.value);
        });

      folder
        .addBinding(translate.duration, 'in', {
          label: 'translate (in)',
          min: 0.15,
          max: 3.0,
          step: 0.05,
        })
        .on('change', (v) => {
          translate.duration.in = Number(v.value);
        });

      folder
        .addBinding(translate.duration, 'out', {
          label: 'translate (out)',
          min: 0.15,
          max: 3.0,
          step: 0.05,
        })
        .on('change', (v) => {
          translate.duration.out = Number(v.value);
        });

      folder.on('change', () => {
        this.updateStyleVariables();
      });
    }
  }
}

export const parameter = new Parameter();
