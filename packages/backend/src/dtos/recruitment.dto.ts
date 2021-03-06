import { Type } from 'class-transformer';
import {
    IsArray,
    IsDateString,
    IsEnum,
    IsInt,
    IsOptional,
    IsPositive,
    IsString,
    IsUUID,
    Matches,
    ValidateNested,
} from 'class-validator';

import { GroupOrTeam, Period } from '@constants/enums';
import { GreaterThan, LessThan } from '@decorators/comparator.decorator';

export class Rid {
    @IsUUID(4)
    rid!: string;
}

export class SetRecruitmentScheduleBody {
    @IsDateString()
    beginning!: string;

    @IsDateString()
    @GreaterThan<SetRecruitmentScheduleBody>('beginning', { message: '`deadline` must be greater than `beginning`' })
    @LessThan<SetRecruitmentScheduleBody>('end', { message: '`deadline` must be less than `end`' })
    deadline!: string;

    @IsDateString()
    end!: string;
}

class InterviewsElement {
    @IsOptional()
    @IsUUID(4)
    id?: string;

    @IsDateString()
    date!: string;

    @IsEnum(Period)
    period!: Period;

    @IsInt()
    @IsPositive()
    slotNumber!: number;
}

export class SetRecruitmentInterviewsParams extends Rid {
    @IsEnum(GroupOrTeam)
    name!: GroupOrTeam;
}

export class SetRecruitmentInterviewsBody {
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => InterviewsElement)
    interviews!: InterviewsElement[];
}

export class CreateRecruitmentBody extends SetRecruitmentScheduleBody {
    @IsString()
    @Matches(/^\d{4}[ASC]$/)
    name!: string;
}
