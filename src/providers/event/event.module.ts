import { Module } from '@nestjs/common';
import { EventService } from './event.service';
import { EventEmitterModule } from '@nestjs/event-emitter';

@Module({
  providers: [EventService],
  exports: [EventService],
  imports: [EventEmitterModule.forRoot()],
})
export class EventModule {}
