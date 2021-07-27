const express = require('express')
const router = express.Router()
const tc = require('../controllers/tagController')
const passport = require('passport')

//Get all tags
router.get("/", passport.authenticate('bearer', { session: false }, { failureRedirect: '/login' }), tc.getAllTags)

//Get tag by id
router.get("/:id", passport.authenticate('bearer', { failureRedirect: '/login' }), tc.getTagById)

//Edit existant tag
router.put("/edittag/:uid",passport.authenticate('bearer', { failureRedirect: '/login' }), tc.editTag)

//Delete tag
router.delete("/deletetag/:uid",passport.authenticate('bearer', { failureRedirect: '/login' }), tc.deleteTag)


module.exports = router