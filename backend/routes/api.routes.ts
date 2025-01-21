import { Router } from 'express';
import { gameController } from '../controllers/room.controller';


export const apiRouter = Router();


apiRouter.post('/create-room', gameController.createRoom);
