import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { Event } from './entities/event.entity';

@Injectable()
export class EventsService {
  constructor(
    @InjectRepository(Event)
    private readonly eventsRepository: Repository<Event>,
  ) {}

  async create(
    userId: string,
    createEventDto: CreateEventDto,
  ): Promise<Event> {
    const event = this.eventsRepository.create({
      ...createEventDto,

      user: {
        id: userId,
      } as User,
    });

    return this.eventsRepository.save(event);
  }

  findAllForUser(userId: string): Promise<Event[]> {
    return this.eventsRepository.find({
      where: {
        user: {
          id: userId,
        },
      },

      order: {
        date: 'ASC',
        time: 'ASC',
      },
    });
  }

  async findOneForUser(
    id: string,
    userId: string,
  ): Promise<Event> {
    const event = await this.eventsRepository.findOne({
      where: {
        id,

        user: {
          id: userId,
        },
      },
    });

    if (!event) {
      throw new NotFoundException('Event not found.');
    }

    return event;
  }

  async update(
    id: string,
    userId: string,
    updateEventDto: UpdateEventDto,
  ): Promise<Event> {
    const event = await this.findOneForUser(id, userId);

    Object.assign(event, updateEventDto);

    return this.eventsRepository.save(event);
  }

  async remove(
    id: string,
    userId: string,
  ): Promise<void> {
    const event = await this.findOneForUser(id, userId);

    await this.eventsRepository.remove(event);
  }
}