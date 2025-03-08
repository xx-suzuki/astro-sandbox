export type ModuleProps = Record<string, any>;

export default abstract class Module<T = ModuleProps> {
  public moduleName: string;
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
