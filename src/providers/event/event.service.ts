import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { EventKey } from './event-key.enum';

@Injectable()
export class EventService {
  constructor(private readonly eventEmitter: EventEmitter2) {}

  emit<T>(event: EventKey, data?: T): void {
    this.eventEmitter.emit(event.toString(), data);
  }
}
