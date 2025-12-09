import { describe, expect, it, beforeEach, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import { useDynamicComponents, HostKey, ParentHostKey } from './useDynamic';
import { shallowReactive, provide } from 'vue';
import type { DynamicHost, DynamicComponentItem } from './model';

// 创建一个简单的测试组件
const TestComponent = {
  template: '<div>Test Component</div>'
};

describe('useDynamicComponents', () => {
  beforeEach(() => {
    // 清除所有提供的注入值
    vi.clearAllMocks();
  });

  it('should create a new host when hostId is provided', () => {
    // 测试在没有父host的情况下创建新host
    const { hostDynamic } = useDynamicComponents({ hostId: 'test-host' });
    
    expect(hostDynamic).toBeDefined();
    expect(hostDynamic.hostId).toBe('test-host');
    expect(hostDynamic.dynamicChildren).toEqual([]);
    expect(hostDynamic.hostChildren).toEqual([]);
  });

  it('should add dynamic component', () => {
    const { hostDynamic, addDynamicComponent, dynamicList } = useDynamicComponents({ hostId: 'test-host' });
    
    const dynamicItem: DynamicComponentItem = {
      id: 'comp-1',
      component: TestComponent,
      props: { title: 'Test Component' },
      slotConfig: { default: { message: 'Hello' } },
      onClose: vi.fn()
    };
    
    addDynamicComponent(dynamicItem);
    
    expect(hostDynamic.dynamicChildren.length).toBe(1);
    expect(dynamicList.value.length).toBe(1);
    expect(hostDynamic.dynamicChildren[0]).toEqual(dynamicItem);
  });

  it('should not add duplicate dynamic component', () => {
    const { hostDynamic, addDynamicComponent } = useDynamicComponents({ hostId: 'test-host' });
    
    const dynamicItem1: DynamicComponentItem = {
      id: 'comp-1',
      component: TestComponent,
      props: { title: 'Test Component 1' }
    };
    
    const dynamicItem2: DynamicComponentItem = {
      id: 'comp-1', // Same ID as dynamicItem1
      component: TestComponent,
      props: { title: 'Test Component 2' }
    };
    
    addDynamicComponent(dynamicItem1);
    addDynamicComponent(dynamicItem2);
    
    expect(hostDynamic.dynamicChildren.length).toBe(1);
    expect(hostDynamic.dynamicChildren[0] && hostDynamic.dynamicChildren[0].props?.title).toBe('Test Component 1'); // Should keep the first one
  });

  it('should remove dynamic component by object', () => {
    const { hostDynamic, addDynamicComponent, removeDynamicComponent } = useDynamicComponents({ hostId: 'test-host' });
    
    const dynamicItem: DynamicComponentItem = {
      id: 'comp-1',
      component: TestComponent
    };
    
    addDynamicComponent(dynamicItem);
    expect(hostDynamic.dynamicChildren.length).toBe(1);
    
    removeDynamicComponent(dynamicItem);
    expect(hostDynamic.dynamicChildren.length).toBe(0);
  });

  it('should remove dynamic component by id', () => {
    const { hostDynamic, addDynamicComponent, removeDynamicComponent } = useDynamicComponents({ hostId: 'test-host' });
    
    const dynamicItem: DynamicComponentItem = {
      id: 'comp-1',
      component: TestComponent
    };
    
    addDynamicComponent(dynamicItem);
    expect(hostDynamic.dynamicChildren.length).toBe(1);
    
    removeDynamicComponent('comp-1');
    expect(hostDynamic.dynamicChildren.length).toBe(0);
  });

  it('should silently fail when removing non-existent component', () => {
    const { hostDynamic, removeDynamicComponent } = useDynamicComponents({ hostId: 'test-host' });
    
    // Should not throw error
    expect(() => removeDynamicComponent('non-existent')).not.toThrow();
    expect(hostDynamic.dynamicChildren.length).toBe(0);
  });

  it('should use parent host when hostId is not provided', () => {
    // Create a parent host and provide it
    const parentHost: DynamicHost = shallowReactive({
      hostId: 'parent-host',
      hostChildren: [],
      parentHost: null,
      dynamicChildren: []
    });
    
    // Mount a component that provides the parent host
    const wrapper = mount({
      setup() {
        provide(ParentHostKey, parentHost);
        provide(HostKey, parentHost);
        return {};
      },
      template: '<div><slot /></div>'
    }, {
      slots: {
        default: {
          setup() {
            // This should use the provided parent host
            const result = useDynamicComponents();
            return () => `<div>Test</div>`;
          }
        }
      }
    });
  });

  it('should create nested hosts', () => {
    // Create a parent host
    const parentHost: DynamicHost = shallowReactive({
      hostId: 'parent-host',
      hostChildren: [],
      parentHost: null,
      dynamicChildren: []
    });
    
    // Mount a component that provides the parent host
    const wrapper = mount({
      setup() {
        provide(ParentHostKey, parentHost);
        provide(HostKey, parentHost);
        return {};
      },
      template: '<div><slot /></div>'
    }, {
      slots: {
        default: {
          setup() {
            // This should create a child host under the parent
            const { hostDynamic } = useDynamicComponents({ hostId: 'child-host' });
            
            expect(hostDynamic).toBeDefined();
            expect(hostDynamic.parentHost).toBe(parentHost);
            expect(parentHost.hostChildren.length).toBe(1);
            expect(parentHost.hostChildren[0]).toBe(hostDynamic);
            
            return () => `<div>Test</div>`;
          }
        }
      }
    });
  });
});
