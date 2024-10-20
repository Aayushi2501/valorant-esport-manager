import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform, TransformFnParams, Type } from 'class-transformer';
import { IsArray, IsBoolean, IsDate, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';


export class PromptDto {
  @ApiProperty()  
  @IsNotEmpty()
  prompt?: string;
}


export class PromptDtoWithId {
  @ApiProperty()  
  @IsNotEmpty()
  id: string;

  @ApiProperty()
  @ApiPropertyOptional()  
  @IsNotEmpty()
  prompt?: string;
}


export class BuidTeamsWithIdsAndPrompts {
  @ApiProperty()  
  @IsNotEmpty()
  ids: string[];

  @ApiProperty()
  @ApiPropertyOptional()  
  @IsNotEmpty()
  prompt?: string;
}