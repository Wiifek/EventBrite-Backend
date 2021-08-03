const TicketSchema = require('../models/ticketSchema');

//List all tickets
exports.listTickets= async (req,res)=>{
    try {
        const tickets = await TicketSchema.find({})
        res.json(tickets);
    }
    catch (err) {
        console.log(err)
        res.status(500).json({message : "Internal server error!"});
    }
}

//Delete Ticket
exports.deleteTicket = async (req, res) => {
    try {
        const id = req.params.id;
        const ticket = await TicketSchema.findById(id);
        if (!ticket)
            res.status(404).json({ message: "This ticket does not exist!" });
        else {

            await TicketSchema.findByIdAndRemove(id);
            res.json({ message: "Ticket with id " + id + " has been deleted successfuly" })
        }
    }
    catch (err) {
        console.log(err)
        res.status(500).json({message : "Internal server error!"});
    }
}
