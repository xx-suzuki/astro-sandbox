export type ModuleProps = Record<string, unknown>;

export default abstract class Module<T = ModuleProps> {
  public moduleName: string;
  protected html = document.documentElement;
  protected props: T | undefined;
  protected target: HTMLElement;

  constructor(element: HTMLElement, properties?: T) {
    this.moduleName = this.constructor.name;
    this.target = element;
    this.props = properties ?? undefined;
  }

  protected abstract init(): void;
}
