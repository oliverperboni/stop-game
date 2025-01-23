import { Router } from 'express';
import { gameController } from '../controllers/room.controller';


export const apiRouter = Router();


apiRouter.post('/room', gameController.createRoom);
apiRouter.get('/result/:gameId', gameController.getGameResult);
