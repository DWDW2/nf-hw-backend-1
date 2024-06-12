import { Request, Response, NextFunction } from 'express';
import { CreateEventDto } from './dtos/CreateEvent.dot';
import EventService from './event-service';
import User from '../auth/models/User';
import { Event } from './models/Event';
import AuthService from '../auth/auth-service';
const mongoose = require('mongoose');
const { ObjectId } = mongoose.Types;


const authService = new AuthService();

const parseJwt = (token) => {
    try {
      return JSON.parse(atob(token.split('.')[1]));
    } catch (e) {
      return null;
    }
  };

class EventController {
    private eventService: EventService;

    constructor(eventService: EventService) {
        this.eventService = eventService;
    }

    createEvent = async (req: Request, res: Response) => {
        try {
            const event: CreateEventDto = req.body;
            const newEvent = await this.eventService.createEvent(event);
            res.status(201).json(newEvent);
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }

    getEvents = async (req: Request, res: Response) => {
        try {
            const { sortBy = 'date', sortOrder = 'asc', page = 1, limit = 10 } = req.query;
            const events = await this.eventService.getEvents(sortBy as string, sortOrder as 'asc' | 'desc', Number(page), Number(limit));
            res.status(200).json(events);
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }

    getEventById = async (req: Request, res: Response) => {
        try {
            const id = req.params.id;
            const event = await this.eventService.getEventById(id);
            if (!event) {
                res.status(404).json({ error: "Event not found" });
            } else {
                res.status(200).json(event);
            }
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }

    getEventsProtected = async (req: Request, res: Response) => {
        const accessToken = req.cookies.accessToken;

        if (!accessToken) {
            return res.status(400).json({ message: 'Access token missing' });
        }

        try {
            console.log(parseJwt(accessToken));
            
            const decodedToken = parseJwt(accessToken)

            if (!decodedToken) {
                return res.status(401).json({ message: 'Invalid access token' });
            }

            const userId = decodedToken.id;
            const user = await User.findOne({_id: new ObjectId(userId)});
            console.log(user)
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }

            interface query {
                page: number;
                limit: number;
                sortBy: string;
                sortOrder: string;
            }

            const { page = 1, limit = 10, sortBy = 'date', sortOrder = 'asc' } = req.query;
            const skip = (Number(page) - 1) * Number(limit);

            const events = await Event.find({ location: user.city })
                .skip(skip)
                .limit(Number(limit))
                .sort({ [sortBy as string]: sortOrder === 'asc' ? 1 : -1 })
                .exec();

            (req as any).events = events;
            res.json(events);
        } catch (error) {
            return res.status(500).json({ message: 'Internal server error' });
        }
    }
}

export default EventController;
