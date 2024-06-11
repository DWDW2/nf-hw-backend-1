import { Request, Response, NextFunction } from 'express';
import { CreateEventDto } from './dtos/CreateEvent.dot';
import EventService from './event-service';
import User from '../auth/models/User';
import Event from './models/Event';

class EventController {
    private eventService : EventService;


    constructor(eventService : EventService){
        this.eventService = eventService;
    }

    createEvent = (req:Request,res:Response) =>{
        try{
            const event: CreateEventDto =req.body;
            const newEvent = this.eventService.createEvent(event);
            res.status(201).json(newEvent);
        }catch(error:any){
            res.status(500).json({ error: error.message });
        }
    }

    getEvents  = (req:Request, res:Response) =>{
        try{
            const events = this.eventService.getEvents();
            res.status(200).json(events);
        }catch (error: any) {
            res.status(500).json({ error: error.message });
          }
    }

    getEventById = (req:Request, res:Response) =>{
        try{
            const params = req.params;
            const id = parseInt(params.id);
            const event = this.eventService.getEventById(id);
            if(!event){
                res.status(404).json({error:"Event not found"});
            }else{
                res.status(200).json(event);
            }
        }catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }

    async getEventsProtected(req: Request, res: Response, next: NextFunction) {
        const userId = req.cookies;
        
        if (!userId) {
            return res.status(400).json({ message: 'User ID header missing' });
        }
  
        try {
            console.log(userId)
            const user = await User.findOne({ _id: userId.id.toString()});
  
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }
  
            // Find events in the user's city
            const events = await Event.find({ location: user.city });
  
            // Attach events to the request object
            (req as any).events = events;
  
            next();
        } catch (error) {
            return res.status(500).json({ message: 'Internal server error' });
        }
}
}


export default EventController;