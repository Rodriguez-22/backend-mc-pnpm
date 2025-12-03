import { PartialType } from '@nestjs/mapped-types';
import { CreateRoleDto } from './create-role.dto';
import { IsString } from 'class-validator/types/decorator/typechecker/IsString';

export class UpdateRoleDto extends PartialType(CreateRoleDto) {
    @IsString()
    
    id: string;
}