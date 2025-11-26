```html
    <div style="overflow: auto; width: 100vw; height: 100vh;">
        <DynamicGrid ref="gridRef">
            <DynamicGridContainer :props=""></DynamicGridContainer>
        </DynamicGrid>
    </div>
```
```typescript
interface DynamicGridProps {
    row: number
    col: number
    minRowHeight?: number
    minColWidth?: number
    autoDirection?: 'horizen' | 'vertical' // 自动计算优先方向
    isTest?: boolean // 测试 显示网格线
}
interface DynamicGridContainerProps {
    row: number; // 占几行几列
    col: number; // 占几行几列
    startRow?: number;
    startCol?: number;
}
interface ContainerComponent {
    name: string;
    draggable: boolean;
    autoDirection?: 'horizen' | 'vertical' // 自动计算优先方向
    
}
const gridRef = ref();
// gridRef.
```