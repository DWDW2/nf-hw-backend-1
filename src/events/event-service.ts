import { CreateEventDto } from './dtos/CreateEvent.dot';
import { IEvent, Event } from './models/Event';


class EventService {
       async getEventById(id: string): Promise<IEvent | null> {
        try {
            return await Event.findById(id).exec();
        } catch (error) {
            console.error('Error fetching event by ID', error);
            return null;
        }
    }

    async getEvents(sortBy: string = 'date', sortOrder: 'asc' | 'desc' = 'asc', page: number = 1, limit: number = 10): Promise<IEvent[]> {
        try {
            const skip = (page - 1) * limit;
            const sortOptions: any = { [sortBy]: sortOrder === 'asc'? 1 : -1 };
            return await Event.find().sort(sortOptions).skip(skip).limit(limit).exec();
        } catch (error) {
            console.error('Error fetching events', error);
            return [];
        }
    }

    async createEvent(eventDto: CreateEventDto): Promise<IEvent> {
        try {
            const newEvent = new Event({
                name: eventDto.name,
                description: eventDto.description,
                date: new Date(eventDto.date),
                location: eventDto.location,
                duration: eventDto.duration,
            });
            return await newEvent.save();
        } catch (error) {
            console.error('Error creating event', error);
            throw new Error('Failed to create event');
        }
    }
}

export default EventService;
