import { IsIn } from 'class-validator';

export class UpdateStatusDto {
  @IsIn(['draft', 'public'])
  status: 'draft' | 'public';
}