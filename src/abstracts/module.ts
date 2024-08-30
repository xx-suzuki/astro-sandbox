import { v4 as uuid } from 'uuid';

export type IModuleProps = Record<string, any>;

export default abstract class Module<T = IModuleProps> {
  public moduleName: string;
  public uuid: string = uuid();
  protected html = document.documentElement;
  protected target: HTMLElement;
  protected props: T | null;

  constructor(element: HTMLElement, props?: T) {
    this.moduleName = this.constructor.name;
    this.target = element;
    this.props = props ?? null;
  }

  protected abstract init(): void;
}
