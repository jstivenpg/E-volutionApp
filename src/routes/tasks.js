const express = require('express');
const { Router } = require('express');
const router = express.Router();

const Task = require('../models/Task');
const { isAuthenticated } = require('../helpers/auth');

router.get('/tasks/add', isAuthenticated,  (req, res) => {
    res.render('tasks/add');
});

router.post('/tasks/add', isAuthenticated, async(req, res) => {
    const { title, description } = req.body;
    const errors = [];
    if(!title){
        errors.push({text: 'Please Write a Title'});
    }
    if(!description){
        errors.push({text: ' Please Write a Description'})
    }
    if(errors.length > 0){
        res.render('tasks/add', {
            errors,
            title,
            description
        });
    } else {
        const newTask = new Task({ title, description });
        newTask.user = req.user.id;
        await newTask.save();
        req.flash('success_msg', 'Tarea agregada con éxito')
        res.redirect('/tasks');
    }
});

router.get('/tasks', isAuthenticated, async(req, res) => {
    const tasks = await Task.find({user: req.user.id}).lean().sort({date: 'desc'});
    res.render('tasks/alltasks', { tasks });
});

router.get('/tasks/edit/:id', isAuthenticated, async(req, res) => {
    const task = await Task.findById(req.params.id).lean();
    res.render('tasks/edit', {task});
});

router.put('/tasks/edit/:id', isAuthenticated, async(req, res) => {
    const { title, description } = req.body;
    await Task.findByIdAndUpdate(req.params.id, { title, description}).lean();
    req.flash('success_msg', 'Tarea actualizada éxitosamente.')
    res.redirect('/tasks');
});

router.delete('/tasks/delete/:id', isAuthenticated, async (req, res) => {
    await Task.findByIdAndRemove(req.params.id).lean();
    req.flash('success_msg', 'Tarea eliminada éxitosamente.')
    res.redirect('/tasks');
});

module.exports = router;
