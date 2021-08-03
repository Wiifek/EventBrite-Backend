const express = require('express')
const router = express.Router()
const tc = require('../controllers/tagController')
const passport = require('passport')

//Get all tags
router.get("/", passport.authenticate('bearer', { session: false }), tc.getAllTags)

//Add tag
router.post("/addtag",passport.authenticate('bearer', { session: false }), tc.addTag)

//Get tag by id
router.get("/:id", passport.authenticate('bearer', { session: false }), tc.getTagById)

//Edit existant tag
router.put("/edittag/:id",passport.authenticate('bearer', { session: false }), tc.editTag)

//Delete tag
router.delete("/deletetag/:id",passport.authenticate('bearer', { session: false }), tc.deleteTag)

module.exports = router