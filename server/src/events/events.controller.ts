import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Request } from 'express';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { JwtPayload } from '../auth/interfaces/jwt-payload.interface';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { EventsService } from './events.service';

@Controller('events')
@UseGuards(JwtAuthGuard)
export class EventsController {
  constructor(
    private readonly eventsService: EventsService,
  ) {}

  @Post()
  create(
    @Req()
    request: Request & { user: JwtPayload },

    @Body()
    createEventDto: CreateEventDto,
  ) {
    return this.eventsService.create(
      request.user.sub,
      createEventDto,
    );
  }

  @Get()
  findAll(
    @Req()
    request: Request & { user: JwtPayload },
  ) {
    return this.eventsService.findAllForUser(
      request.user.sub,
    );
  }

  @Get(':id')
  findOne(
    @Param('id', ParseUUIDPipe)
    id: string,

    @Req()
    request: Request & { user: JwtPayload },
  ) {
    return this.eventsService.findOneForUser(
      id,
      request.user.sub,
    );
  }

  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe)
    id: string,

    @Req()
    request: Request & { user: JwtPayload },

    @Body()
    updateEventDto: UpdateEventDto,
  ) {
    return this.eventsService.update(
      id,
      request.user.sub,
      updateEventDto,
    );
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(
    @Param('id', ParseUUIDPipe)
    id: string,

    @Req()
    request: Request & { user: JwtPayload },
  ): Promise<void> {
    await this.eventsService.remove(
      id,
      request.user.sub,
    );
  }
}