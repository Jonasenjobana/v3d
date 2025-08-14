/**
 * 
- 提交
    - 报警设备选择
- 审批
    - 维修派单
    - 驳回
    - 解除
- 处理
    - 维修处理
- 验收
    - 驳回
    - 办结
- 办结

- 暂存
- 驳回
*/
class Process {
    /**工单设备信息 */
    info
    processList: []
}
const temp = /*html*/`
    @for(let item in processList) {
        // 流程展示
        <sl-col-card [type]="item.type">
            @if(item.type == 'commit') {

            }
            @if(item.type == 'approval') {

            }
            @if(item.type == 'handle') {
                
            }
            @if(item.type == 'accept') {
                
            }
            @if(item.type == 'finish') {
                
            }
        </sl-col-card>
        <sl-col-card>
            <sl-row-card [status]="status"></sl-row-card>
            <form></form>
        </sl-col-card>
    }
`