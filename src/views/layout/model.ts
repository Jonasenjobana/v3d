export interface SLMenuItem extends IVListItem {
    divider?: boolean
    type?: 'item' | 'subheader' | 'divider'
    children?: SLMenuItem[]
    hidden?: boolean
}