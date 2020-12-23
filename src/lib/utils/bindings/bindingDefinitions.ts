/* eslint-disable @typescript-eslint/naming-convention,@typescript-eslint/no-explicit-any */

import type { Ref } from '@vue/reactivity';
import type { ComponentFactory } from '../../Component.types';
import type {
  CollectionRef,
  ComponentParams,
  ComponentsRef,
  AnyRef,
  ElementRef,
} from '../refs/refDefinitions.types';
import type { Binding, BindProps, TemplateProps } from './bindings.types';

/////
// Definitions
////

export function BindElement<T extends HTMLElement>(ref: Ref<T | undefined>, props: BindProps) {
  return {
    ref,
    type: 'element' as const,
    props: props,
  };
}

// eslint-disable-next-line @typescript-eslint/naming-convention
export function BindCollection<T extends HTMLElement>(ref: Ref<Array<T>>, props: BindProps) {
  return {
    ref,
    type: 'collection' as const,
    props: props,
  };
}

// eslint-disable-next-line @typescript-eslint/naming-convention
export function BindComponent<
  T extends Pick<ReturnType<ComponentFactory<any>>, 'setProps' | 'element'>
>(ref: Ref<T | undefined>, props: ComponentParams<T>) {
  return {
    ref,
    type: 'component' as const,
    props: props,
  };
}

// eslint-disable-next-line @typescript-eslint/naming-convention
export function BindComponents<
  T extends Pick<ReturnType<ComponentFactory<any>>, 'setProps' | 'element'>
>(ref: Ref<Array<T>>, props: ComponentParams<T>) {
  return {
    ref,
    type: 'componentCollection' as const,
    props: props,
  };
}

export function BindTemplate<T extends HTMLElement>(
  props: TemplateProps<T>,
): { type: 'template'; props: TemplateProps<T> } {
  return {
    type: 'template',
    props: props,
  };
}

/////
// Component functions
////

export function bind<T extends Pick<AnyRef, 'getBindingDefinition'>>(
  target: T,
  props: Parameters<T['getBindingDefinition']>[0],
) {
  return target.getBindingDefinition(props);
}

export function bindMap<
  T extends Pick<
    CollectionRef<HTMLElement, BindProps> | ComponentsRef<ComponentFactory<any>>,
    'refs' | 'getBindingDefinition'
  >
>(
  target: T,
  getProps: (ref: T['refs'][number], index: number) => Parameters<T['getBindingDefinition']>[0],
): Array<Binding> {
  return (target.refs as Array<T['refs'][number]>).map((ref, index) =>
    bind(ref, getProps(ref, index)),
  );
}

export function bindTemplate<P extends Record<string, unknown>>(
  target: ElementRef<HTMLElement | undefined, BindProps>,
  data: Ref<P>,
  template: (props: P) => string | Array<string>,
  {
    extract,
    renderImmediate = false,
  }: {
    extract?: {
      config: any;
      onData: (data: any) => void;
    };
    renderImmediate?: boolean;
  } = {},
): {
  type: 'template';
  props: TemplateProps<HTMLElement>;
} {
  return BindTemplate({ ref: target, data, template, extract, renderImmediate });
}
