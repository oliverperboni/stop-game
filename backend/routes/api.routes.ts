import { Router } from 'express';
import { gameController } from '../controllers/room.controller';


export const apiRouter = Router();

// apiRouter.post('/start', gameController.startGame);
apiRouter.post('/stop', gameController.createRoom);
