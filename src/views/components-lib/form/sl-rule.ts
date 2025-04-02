export type SLRuleType = 'pwd' | 'email'
export const requireRule = (v: any) => !!v || '不能为空';
export const SLRules = {
    'pwd': [
        requireRule,
    ]
}