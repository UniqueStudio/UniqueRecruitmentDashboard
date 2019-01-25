import { STEPS } from 'Config/consts';

interface Model {
    type: string;
    name?: string;
    title?: string;
    group?: string;
    step: number;
    time?: string;
    place?: string;
    rest?: string;
}

export default ({ type, name = '{{候选人姓名}}', title = '{{招新名称}}', group = '{{组别}}', step, time, place, rest }: Model) => {
    switch (type) {
        case 'accept': {
            let defaultRest = '';
            switch (step) {
                case 1:
                case 3:
                    defaultRest = `，请进入以下链接选择面试时间：`;
                    break;
                case 0:
                case 2:
                    defaultRest = `，请于${time || '{{时间}}'}在${place || '{{地点}}'}参加${STEPS[step + 1]}，请务必准时到场`;
                    break;
                case 4:
                    defaultRest = `，你已成功加入${group}组`;
                    break;
                default:
                    break;
            }
            rest = rest || defaultRest;
            return `[联创团队]${name}你好，你通过了${title}${group}组${STEPS[step] || '{{xx流程}}'}审核${rest}`;
        }
        case 'reject': {
            const defaultRest = '不要灰心，继续学习。期待与更强大的你的相遇！';
            rest = rest || defaultRest;
            return `[联创团队]${name}你好，你没有通过${title}${group}组${STEPS[step] || '{{xx流程}}'}审核，请你${rest}`;
        }
        case 'group': {
            return `[联创团队]${name}你好，请于{{时间(默认)}}在启明学院亮胜楼${place || '{{地点}}'}参加组面，请准时到场`;
        }
        case 'team': {
            return `[联创团队]${name}你好，请于{{时间(默认)}}在启明学院亮胜楼${place || '{{地点}}'}参加群面，请准时到场`;
        }
        default:
            return '';
    }
};
