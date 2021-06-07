import { IsEnum, IsString } from 'class-validator';
import { Column, Entity, ManyToOne } from 'typeorm';

import { Evaluation } from '@constants/enums';
import { ApplicationEntity } from '@entities/application.entity';
import { CommonEntity } from '@entities/common.entity';
import { MemberEntity } from '@entities/member.entity';

@Entity('comments')
export class CommentEntity extends CommonEntity {
    @ManyToOne(() => ApplicationEntity, ({ comments }) => comments, { onDelete: 'CASCADE' })
    candidate!: ApplicationEntity;

    @ManyToOne(() => MemberEntity, ({ comments }) => comments, { onDelete: 'CASCADE' })
    user!: MemberEntity;

    @Column()
    @IsString()
    content!: string;

    @Column('enum', { enum: Evaluation })
    @IsEnum(Evaluation)
    evaluation!: Evaluation;
}
