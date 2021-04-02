import io from 'socket.io-client';

import { getOneRecruitment } from '@apis/rest';
import { API, STEP_MAP } from '@config/consts';
import { Status, Step } from '@config/enums';
import { Candidate, Comment, Message, R, Recruitment } from '@config/types';
import { stores } from '@stores/index';

const { $component, $recruitment, $candidate, $user } = stores;

const socket = io(API);

export const addComment = (cid: string, comment: Pick<Comment, 'evaluation' | 'content'>) => {
    socket.emit('addComment', { cid, comment, token: $user.token });
    $component.setProgress(true);
};

export const removeComment = (id: string) => {
    socket.emit('removeComment', { id, token: $user.token });
    $component.setProgress(true);
};

export const sendMessage = (message: Message) => {
    socket.emit('sendMessage', { message });
    $user.addMessage(message);
};

socket.on('disconnect', () => socket.close());

socket.on('addComment', (res: R<{ cid: string; comment: Comment }>) => {
    switch (res.status) {
        case Status.success:
            $component.setProgress(false);
        // eslint-disable-next-line no-fallthrough
        case Status.info: {
            const { cid, comment } = res.payload;
            $candidate.addComment(cid, comment);
        }
    }
});

socket.on('removeComment', (res: R<{ cid: string; id: string }>) => {
    switch (res.status) {
        case Status.success:
            $component.setProgress(false);
        // eslint-disable-next-line no-fallthrough
        case Status.info: {
            const { cid, id } = res.payload;
            $candidate.removeComment(cid, id);
        }
    }
});

socket.on('newCandidate', (res: R<Candidate & { recruitment: Recruitment }>) => {
    switch (res.status) {
        case Status.info: {
            const candidate = res.payload;
            const {
                group,
                name,
                recruitment: { id },
            } = candidate;
            if (id === $recruitment.viewingId) {
                $candidate.setOne(candidate);
                $component.enqueueSnackbar(`${name}报名了${group}组`, Status.info);
            }
        }
    }
});

socket.on('updateCandidate', (res: R<Candidate & { recruitment: Recruitment }>) => {
    switch (res.status) {
        case Status.info: {
            const candidate = res.payload;
            const {
                group,
                name,
                recruitment: { id },
            } = candidate;
            if (id === $recruitment.viewingId) {
                $candidate.setOne(candidate);
                $component.enqueueSnackbar(`${group}组的${name}更新了个人信息`, Status.info);
            }
        }
    }
});

socket.on('removeCandidate', (res: R<string>) => {
    switch (res.status) {
        case Status.info: {
            const candidate = $candidate.candidates.get(res.payload);
            if (candidate) {
                const { group, name, id } = candidate;
                $candidate.removeOne(id);
                $component.enqueueSnackbar(`${group}组的${name}被移除了`, res.status);
            }
        }
    }
});

socket.on('moveCandidate', (res: R<{ cid: string; to: Step }>) => {
    switch (res.status) {
        case Status.info: {
            const { cid, to } = res.payload;
            const candidate = $candidate.candidates.get(cid);
            if (candidate && candidate.step !== to) {
                const { group, name, id } = candidate;
                $candidate.moveOne(id, to);
                $component.enqueueSnackbar(`${group}组的${name}被移动到了${STEP_MAP.get(to)!}`, res.status);
            }
        }
    }
});

socket.on('updateRecruitment', (res: R<string>) => {
    switch (res.status) {
        case Status.info:
            void getOneRecruitment(res.payload);
    }
});

socket.on('receiveMessage', (res: R<Message>) => {
    switch (res.status) {
        case Status.info:
            $user.addMessage({ ...res.payload, isSelf: false });
    }
});

socket.on('exception', (res: R) => {
    switch (res.status) {
        case Status.error:
        case Status.warning:
            $component.enqueueSnackbar(res.message, res.status);
            $component.setProgress(false);
    }
});
