import * as actions from '../action';
import { CANDIDATE, COMMENT } from '../epic';

import { Candidate } from '../lib/const';
import mapToObj from '../lib/mapToObj';

const user = localStorage.getItem('userInfo');
const group = user && JSON.parse(user) && JSON.parse(user).group;

const init = {
    candidates: [],
    selected: [],
    isLoading: {
        comments: false,
        candidates: false,
    },
    group: group || 'web',
    inputtingComment: {
        comment: '',
        evaluation: '',
    },
    shouldUpdateCandidates: false,
};

type Action =
    actions.AddCandidateFulfilled
    | actions.AddCommentFulfilled
    | actions.DeselectCandidate
    | actions.GetCandidatesFulfilled
    | actions.MoveCandidateFulfilled
    | actions.RecordInputtingComment
    | actions.RemoveCandidateFulfilled
    | actions.RemoveCommentFulfilled
    | actions.SelectCandidate
    | actions.SetGroup
    | actions.SetSlotsFulfilled;

export interface Candidates {
    candidates: Map<string, Candidate>[];
    selected: string[];
    isLoading: {
        comments: boolean;
        candidates: boolean;
    };
    group: string;
    inputtingComment: {
        comment: string;
        evaluation: string;
    };
    shouldUpdateCandidates: boolean;
}

export function candidates(
    state: Candidates = init,
    action: Action,
): Candidates {
    const newState = { ...state };
    switch (action.type) {
        case COMMENT.START:
            newState.isLoading.comments = true;
            return newState;
        case COMMENT.SUCCESS:
        case COMMENT.FAILURE:
            newState.isLoading.comments = false;
            return newState;
        case actions.ADD_COMMENT_FULFILLED:
            if (!newState.candidates[action.step] || !newState.candidates[action.step].get(action.cid)) {
                return newState;
            }
            newState.candidates[action.step].get(action.cid)!.comments[action.commenter] = action.comment;
            newState.inputtingComment = {
                comment: '',
                evaluation: '',
            };
            sessionStorage.setItem(newState.group, JSON.stringify(newState.candidates.map((i) => mapToObj(i))));
            if (newState.group === 'interview') {
                newState.shouldUpdateCandidates = true;
            }
            return newState;
        case actions.REMOVE_COMMENT_FULFILLED:
            if (!newState.candidates[action.step] || !newState.candidates[action.step].get(action.cid)) {
                return newState;
            }
            delete newState.candidates[action.step].get(action.cid)!.comments[action.commenter];
            sessionStorage.setItem(newState.group, JSON.stringify(newState.candidates.map((i) => mapToObj(i))));
            if (newState.group === 'interview') {
                newState.shouldUpdateCandidates = true;
            }
            return newState;
        case CANDIDATE.START:
            newState.isLoading.candidates = true;
            return newState;
        case CANDIDATE.SUCCESS:
        case CANDIDATE.FAILURE:
            newState.isLoading.candidates = false;
            return newState;
        case actions.GET_CANDIDATES_FULFILLED:
            const candidatesToMap = action.candidates.map((i) => new Map(Object.entries(i)));
            return { ...state, candidates: candidatesToMap, shouldUpdateCandidates: false };
        case actions.ADD_CANDIDATE_FULFILLED:
            const { group: candidateGroup, step, _id } = action.candidate;
            if (newState.group === candidateGroup) {
                if (!newState.candidates[step]) newState.candidates[step] = new Map<string, Candidate>();
                newState.candidates[step].set(_id, action.candidate);
                sessionStorage.setItem(newState.group, JSON.stringify(newState.candidates.map((i) => mapToObj(i))));
            }
            return newState;
        case actions.SELECT_CANDIDATE:
            newState.selected = [...new Set(newState.selected.concat(action.cid))];
            return newState;
        case actions.DESELECT_CANDIDATE:
            newState.selected = newState.selected.filter((i: string) => !action.cid.includes(i));
            return newState;
        case actions.REMOVE_CANDIDATE_FULFILLED:
            newState.candidates.map((i) =>
                typeof action.cid === 'string'
                    ? i.delete(action.cid)
                    : action.cid.map((j) => i.delete(j)));
            newState.selected = newState.selected.filter((i: string) => !action.cid.includes(i));
            sessionStorage.setItem(newState.group, JSON.stringify(newState.candidates.map((i) => mapToObj(i))));
            newState.shouldUpdateCandidates = true;
            return newState;
        case actions.MOVE_CANDIDATE_FULFILLED:
            if (!newState.candidates[action.from] || !newState.candidates[action.from].get(action.cid)) return newState;
            const info = { ...newState.candidates[action.from].get(action.cid) } as Candidate;
            newState.candidates[action.from].delete(action.cid);
            if (!newState.candidates[action.to]) {
                newState.candidates[action.to] = new Map<string, Candidate>();
            }
            if (action.position !== undefined) {
                const entries = [...newState.candidates[action.to].entries()];
                entries.splice(action.position, 0, [action.cid, info]);
                newState.candidates[action.to] = new Map<string, Candidate>(entries);
            } else {
                newState.candidates[action.to].set(action.cid, info);
            }
            sessionStorage.setItem(newState.group, JSON.stringify(newState.candidates.map((i) => mapToObj(i))));
            newState.shouldUpdateCandidates = true;
            return newState;
        case actions.SET_GROUP:
            return { ...state, group: action.group };
        case actions.RECORD_INPUTTING_COMMENT:
            return { ...state, inputtingComment: { evaluation: action.evaluation, comment: action.comment } };
        case actions.SET_SLOTS_FULFILLED:
            action.slot.map((i) => {
                const candidatesInInterview = newState.candidates[action.interview === 1 ? 2 : 4];
                const candidatesInfo = candidatesInInterview.get(i['_id']);
                candidatesInInterview.set(i['_id'], {
                    ...candidatesInfo,
                    [`slot${action.interview}`]: i[`slot${action.interview}`],
                } as Candidate);
            });
            sessionStorage.setItem(newState.group, JSON.stringify(newState.candidates.map((i) => mapToObj(i))));
            return newState;
    }
    return state;
}
