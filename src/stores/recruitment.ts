import { set } from 'idb-keyval';
import { makeAutoObservable, toJS } from 'mobx';

import { Recruitment } from '@config/types';
import { compareTitle } from '@utils/compareTitle';
import { localStorage } from '@utils/storage';

export class RecruitmentStore {
    recruitments = new Map<string, Recruitment>();

    viewingId = localStorage.getItem('viewingId') || '';

    constructor() {
        makeAutoObservable(this);
    }

    get recruitmentsArray() {
        return [...this.recruitments.values()].sort((a, b) => compareTitle(b.name, a.name));
    }

    get viewingRecruitment() {
        return this.recruitments.get(this.viewingId);
    }

    setRecruitment(recruitment: Partial<Recruitment> & { id: string }, saveToIDB = true) {
        const { id, interviews } = recruitment;
        interviews?.sort((a, b) => {
            if (+a.date === +b.date) {
                return a.period - b.period;
            }
            return +a.date - +b.date;
        });
        this.recruitments.set(id, { ...this.recruitments.get(id), ...(recruitment as Recruitment) });
        saveToIDB && void set('recruitments', toJS(this.recruitments));
    }

    setRecruitments(recruitments: Recruitment[]) {
        for (const recruitment of recruitments) {
            this.setRecruitment(recruitment, false);
        }
        void set('recruitments', toJS(this.recruitments));
    }

    setAll(recruitments: Map<string, Recruitment>) {
        this.recruitments = recruitments;
    }

    setViewingRecruitment(rid: string) {
        this.viewingId = rid;
        localStorage.setItem('viewingId', rid);
    }
}
