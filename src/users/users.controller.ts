import { ClassSerializerInterceptor, Controller, UseInterceptors } from '@nestjs/common';
 @UseInterceptors(ClassSerializerInterceptor)
@Controller('users')
export class UsersController {}
