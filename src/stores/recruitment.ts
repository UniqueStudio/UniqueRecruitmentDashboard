import { set } from 'idb-keyval';
import { makeAutoObservable } from 'mobx';

import { Recruitment } from '@config/types';
import { compareTitle } from '@utils/compareTitle';
import { localStorage } from '@utils/storage';

export class RecruitmentStore {
    recruitments = new Map<string, Recruitment>();

    viewing = localStorage.getItem('viewing') || '';

    shouldUpdateRecruitment = true;

    constructor() {
        makeAutoObservable(this);
    }

    get recruitmentsArray() {
        return [...this.recruitments.values()].sort((a, b) => compareTitle(b.name, a.name));
    }

    setRecruitments(recruitments: Recruitment[]) {
        for (const recruitment of recruitments) {
            this.recruitments.set(recruitment.id, recruitment);
        }
        this.shouldUpdateRecruitment = false;
        void set('recruitments', recruitments);
    }

    setShouldUpdateRecruitment(shouldUpdate = true) {
        this.shouldUpdateRecruitment = shouldUpdate;
    }

    setViewingRecruitment(rid: string) {
        this.viewing = rid;
        localStorage.setItem('viewing', rid);
    }
}
