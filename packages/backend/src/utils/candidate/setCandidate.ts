import { verifyJWT } from '../../lib/checkData';
import { ObjectId } from 'mongodb';
import { database } from '../../app';
import { Request, Response } from 'express';

export const setCandidate = (req: Request, res: Response) => {
    const patch = req.body.patch;
    if (!patch || Object.keys(patch).length !== 1 || !(patch.time1 || patch.time2 || patch.abandon || patch.slot1 || patch.slot2)) {
        res.send({ message: '信息不正确', type: 'warning' });
        return;
    }
    (async () => {
        try {
            verifyJWT(req.get('Authorization'));
            const candidateResult = (await database.query('candidates', { _id: new ObjectId(req.params.cid) }))[0];
            if (!candidateResult) {
                res.send({ message: '候选人不存在!', type: 'warning' });
                return;
            }
            if ((candidateResult.time1 && patch.time1)
                || (candidateResult.time2 && patch.time2)
            || candidateResult.abandon) {
                res.send({ message: '不能重复提交时间!', type: 'warning' });
                return;
            }
            await database.update('candidates', { _id: new ObjectId(req.params.cid) }, patch);
            res.send({ type: 'success' });
        } catch (err) {
            res.send({ message: err.message, type: 'danger' })
        }
    })();
};