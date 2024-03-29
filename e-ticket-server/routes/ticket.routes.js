import express from 'express';
import ticketController from '../controllers/ticket.controller.js';

const router = express.Router();

router.post('/', ticketController.createTicket);
router.post('/many', ticketController.createManyTicket);
router.get('/', ticketController.getAllTickets);
router.get('/client/:clientId', ticketController.getTicketsByClientId);
router.get('/event/:eventId', ticketController.getTicketsByEventId);
router.delete('/:id', ticketController.deleteticketById);
router.post('/delete-many', ticketController.deleteManyTicketsById);
router.put('/:id', ticketController.updateTicket);

export default router;
