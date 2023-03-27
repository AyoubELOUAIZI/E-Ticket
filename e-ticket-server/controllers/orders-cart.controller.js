import cardService from '../services/card.service.js';
import ordersCartService from '../services/orders-cart.service.js';
import seatCategoryService from '../services/seat-category.service.js';
import ticketService from '../services/ticket.service.js';

const createOrder = async (req, res) => {
    try {
        const newOrder = await ordersCartService.createOrder(req.body);
        res.json(newOrder);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to create order' });
    }
};



const addToCart = async (req, res) => {
    try {
        // console.log(req.body)
        //we do not want to add existing order cart if not paid but increment quantity
        const { client_id, event_id } = req.body;
        const nonPaidOrderByEvent = await ordersCartService.getClientNonPaidOrdersByEevnt(client_id, event_id);
        if (nonPaidOrderByEvent) {
            // console.log(nonPaidOrderByEvent)
            const { order_id, quantity, unitPrice } = nonPaidOrderByEvent;
            //UPDATE nonPaidOrderByEvent BY INCREMENT QUANTITY and update total price only
            const updatedOrdersCart = await ordersCartService.updateOrdersCart(order_id, { quantity: quantity + 1, total_price: quantity + 1 * unitPrice });
            return res.status(200).json(updatedOrdersCart);
        }

        //the initial info of the seat categorie when add cart by defaul will be the sheapest one info
        const cheapestSeatCategory = await seatCategoryService.getSheapestSeatCategorieByEevntId(parseInt(req.body.event_id));
        if (!cheapestSeatCategory) {
            return res.status(500).json({ error: 'Failed to find seat categorie and add event to cart' });
        }
        // console.log(cheapestSeatCategory);
        const orderData = req.body;
        const { seat_categ_id, type_price } = cheapestSeatCategory;
        orderData.seat_categ_id = seat_categ_id;
        orderData.total_price = type_price;
        orderData.unitPrice = type_price;
        const newOrder = await ordersCartService.createOrder(orderData);
        if (newOrder) {
            return res.json(newOrder);
        } else {
            return res.json({ error: 'Failed to create order' })
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to create order internal server error' });
    }
};

const createManyOrder = async (req, res) => {
    const { OrdersData } = req.body;
    try {
        const newOrders = await Promise.all(
            OrdersData.map(Order =>
                ordersCartService.createOrder(Order)
            )
        );
        res.json(newOrders);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to create Orders' });
    }
};



const getAllOrders = async (req, res) => {
    try {
        const orders = await ordersCartService.getAllOrders();
        res.status(200).json(orders);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error to get all orders cart' });
    }
};
const getOrderById = async (req, res) => {
    const orderId = req.params.orders_Cart_id;
    try {
        const Order = await ordersCartService.getOrderById(orderId);
        if (Order) {
            res.status(200).json(Order);
        } else {
            res.status(404).json({ error: `Order with ID ${orderId} not found` });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error ' });
    }
}


const getClientNonPaidOrders = async (req, res) => {
    const clientId = req.params.clientId;
    try {
        const NonPaidOrders = await ordersCartService.getClientNonPaidOrders(clientId);
        if (NonPaidOrders) {
            res.status(200).json(NonPaidOrders);
        } else {
            res.status(404).json({ error: `there is no Non paid orders for the client with id ${clientId}` });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: `Internal server error to get not paid orders of client with id ${clientId} ` });
    }
}


const deleteOrdersCarttById = async (req, res) => {
    const id = req.params.id;
    try {
        const deletedOrdersCart = await ordersCartService.deleteOrdersCarttById(parseInt(id));
        if (deletedOrdersCart) {
            res.json(deletedOrdersCart);
        } else {
            res.status(404).json({ error: `OrdersCart with id ${id} not found` });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

const deleteManyOrdersCarttById = async (req, res) => {
    const ordersIdsData = req.body.selectedCards;
    // console.log(ordersIdsData)
    try {
        const deletedOrdersCart = await Promise.all(
            ordersIdsData.map(orderId =>
                ordersCartService.deleteOrdersCarttById(orderId)
            ));
        // console.log(deletedOrdersCart)
        res.status(200).json(deletedOrdersCart);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error to delete many orders' });
    }
};


// Update orders cart
const updateOrdersCart = async (req, res) => {
    try {
        const orderId = req.params.order_id;
        const updatedData = req.body;
        const updatedOrdersCart = await ordersCartService.updateOrdersCart(orderId, updatedData);
        res.status(200).json(updatedOrdersCart);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to update orders cart' });
    }
};

const getRecentOrdersByOrganizer = async (req, res) => {
    const org_id = req.params.orgId;
    try {
        const recentOrders = await ordersCartService.getRecentOrdersByOrganizer(org_id);

        if (recentOrders && recentOrders.length > 0) {
            res.status(200).json(recentOrders);
        } else {
            res.status(404).json({ error: `No Orders found for organizer with ID ${org_id}` });
        }

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to get recent orders' });
    }
};

const getAllOrdersByOrganizer = async (req, res) => {
    const org_id = req.params.orgId;
    try {
        const allOrders = await ordersCartService.getAllOrdersByOrganizer(org_id);

        if (allOrders && allOrders.length > 0) {
            res.status(200).json(allOrders);
        } else {
            res.status(404).json({ error: `No Orders found for organizer with ID ${org_id}` });
        }

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to get recent orders' });
    }
};




const createOrdersPayment = async (req, res) => {
    const { clientId } = req.params;
    //the table eventAndSeat_Ids contains eventid and seatid and also organizerid
    const { totalPriceCheckOut, cardInfo, eventAndSeat_Ids } = req.body;
    try {
        const card = await cardService.validateCard(totalPriceCheckOut, cardInfo);
        if (!card) {
            return res.status(400).json({ error: "card not valide can not make transaction" });
        }
        if (card === 'sold error') {
            return res.status(400).json({ error: "card sold not valid can not make transaction" });
        }
        //add qr codes to the table eventAndSeat_Ids
        const randomString = Math.random().toString(36).substring(7); // generate a random string
        const uniqueId = Date.now(); // generate a unique identifier
        const qrCodeText = `${randomString}-${uniqueId}`; // concatenate the random string and unique identifier

        //create tickets for the client eventAndSeat_Ids
        const newTickets = await Promise.all(
            eventAndSeat_Ids.map(item => {
                //
                const randomString = Math.random().toString(36).substring(7); // generate a random string
                const uniqueId = Date.now(); // generate a unique identifier
                const qrCodeText = `${randomString}-${uniqueId}`; // concatenate the random string and unique identifier
                //create ticket
                return ticketService.createTicket({ event_id: item.event_id, seat_categ_id: item.seat_categ_id, client_id: parseInt(clientId), qrcode: qrCodeText });
            }));

        if (!newTickets || newTickets.some(ticket => !ticket)) {
            //some times if there are many some will be created and some not
            //delete the ones which was create
            await Promise.all(newTickets.map(ticket => {
                if (ticket) {
                    ticketService.deleteticketById(parseInt(ticket.ticket_id))
                }
            }));
            return res.status(400).json({ error: "An error shows when creating the tickets so it is canced" });
        }

        //after that we create ticket will make payment transforming by update sold in card of client
        //and update the profit of organizers

        //update the client card
        const updatedClientCard = await cardService.updateCard(cardInfo.cardNumber, { sold: card.sold - totalPriceCheckOut });
        if (!updatedClientCard) {
            //because of this problem will delete created ticket
            await Promise.all(newTickets.map(ticket => {
                if (ticket) {
                    ticketService.deleteticketById(parseInt(ticket.ticket_id))
                }
            }));
            res.status(400).json({ error: "error shows when updating the sold of client card" });
        }

        //update the organizer profit



    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to create order' });
    }
};





export default {
    createOrder,
    createManyOrder,
    getAllOrders,
    getOrderById,
    deleteManyOrdersCarttById,
    getClientNonPaidOrders,
    deleteOrdersCarttById,
    updateOrdersCart,
    getRecentOrdersByOrganizer,
    getAllOrdersByOrganizer,
    addToCart,
    createOrdersPayment,
};
