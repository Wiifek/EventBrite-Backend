const UserSchema = require("../models/userSchema")

//Get all users
exports.getAllUsers = async (req, res) => {
    try {
        const users = await UserSchema.find({})
        res.json(users);
    } catch (err) {
        console.log(err)
        res.status(500).send("Internal server error!");
    }
}

//Get user by id
exports.getUserById = async (req, res) => {
    try {
        const id = req.params.id;
        const user = await UserSchema.findById(id)
        if (user) {
            res.json(user);
        } else {
            res.status(404).json({ message: 'User not foud!' })
        }
    }
    catch (err) {
        console.log(err)
        res.status(500).send("Internal server error!");
    }
}

//Edit existant user
exports.editUser = async (req, res) => {
    try {
        const userData = req.body;
        const id = req.params.uid;
        const user = await UserSchema.findById(id);
        if (!user)
            res.status(404).json({ message: "This user does not exist!" });
        else {

            const updatedUser = await UserSchema.findByIdAndUpdate(id, userData, { new: true });
            res.json(updatedUser)
        }
    }
    catch (err) {
        console.log(err)
        res.status(500).send("Internal server error!");
    }
}

//Delete user
exports.deleteUser = async (req, res) => {
    try {
        const id = req.params.uid;
        const user = await UserSchema.findById(id);
        if (!user)
            res.status(404).json({ message: "This user does not exist!" });
        else {

            await UserSchema.findByIdAndRemove(id);
            res.json({ message: "User with id " + id + " has been deleted successfuly" })
        }
    }
    catch (err) {
        console.log(err)
        res.status(500).send("Internal server error!");
    }
}

//cancel ticket
exports.cancelTicket = async (req, res) => {
    try {
        const id = req.params.uid;
        const ticketId = req.params.todoid;
        const ticket = await todoSchema.findById(ticketId);
        const user = await UserSchema.findById(id);

        if (!user)
            res.json({ message: "User does not exist!" })
        else if (!todo)
            res.json({ message: "This ticket does not exist!" })
        else {
            const updatedUser = await UserSchema.findByIdAndUpdate(id, { $pull: { tickets: ticket._id } }, { new: true });
            res.json(updatedUser)
        }
    }
    catch (err) {
        console.log(err)
        res.status(500).send("Internal server error!");
    }
}

//Show all tickets
exports.showUserTickets = async (req, res) => {
    try {
        const id = req.params.uid;
        const user = await UserSchema.findById(id);

        if (!user)
            res.json({ message: "User does not exist!" })
        else {
            const list = await UserSchema.findById(id).populate('tickets');
            res.json(list)
        }
    }
    catch (err) {
        console.log(err)
        res.status(500).send("Internal server error!");
    }
}