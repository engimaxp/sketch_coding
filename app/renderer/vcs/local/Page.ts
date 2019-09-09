import {settings} from '../../constants';

// page index start from 1
export default class Page {
    index: number;
    size: number;
    constructor(pageIndex: number, pageSize: number) {
        if (!pageIndex || pageIndex <= 0) {
            pageIndex = 1;
        }
        if (!pageSize || pageSize <= 0) {
            pageSize = settings.diaryPageDefaultSize;
        }
        this.index = pageIndex;
        this.size = pageSize;
    }
}
