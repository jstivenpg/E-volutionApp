const express = require('express');
const { Router } = require('express');
const router = express.Router();

const Task = require('../models/Task');
const { isAuthenticated } = require('../helpers/auth');

router.get('/tasks/add', isAuthenticated,  (req, res) => {
    res.render('tasks/add');
});

router.post('/tasks/add', isAuthenticated, async(req, res) => {
    const { title, description, priority, fecha_vencimiento } = req.body;
    const errors = [];
    if(!title){
        errors.push({text: 'Por favor escribe un titulo'});
    }
    if(!description){
        errors.push({text: ' Por favor escribe una descripción'})
    }
    if(!priority){
        errors.push({text: 'Seleccionar una prioridad'});
    }
    if(!fecha_vencimiento){
        errors.push({text: ' Seleccionar fecha de vencimiento'})
    }
    if(errors.length > 0){
        res.render('tasks/add', {
            errors,
            title,
            description,
            priority,
            fecha_vencimiento
        });
    } else {
        const newTask = new Task({ title, description, priority, fecha_vencimiento });
        newTask.user = req.user.id;
        await newTask.save();
        req.flash('success_msg', 'Tarea agregada con éxito')
        res.redirect('/tasks');
    }
});

router.get('/tasks', isAuthenticated, async(req, res) => {
    const tasks = await Task.find({user: req.user.id}).lean().sort({fecha_vencimiento: 'asc'});
    res.render('tasks/alltasks', { tasks });
});

router.get('/tasks/edit/:id', isAuthenticated, async(req, res) => {
    const task = await Task.findById(req.params.id).lean();
    res.render('tasks/edit', {task});
});

router.put('/tasks/edit/:id', isAuthenticated, async(req, res) => {
    const { title, description } = req.body;
    await Task.findByIdAndUpdate(req.params.id, { title, description, priority, fecha_vencimiento}).lean();
    req.flash('success_msg', 'Tarea actualizada éxitosamente.')
    res.redirect('/tasks');
});

router.delete('/tasks/delete/:id', isAuthenticated, async (req, res) => {
    await Task.findByIdAndRemove(req.params.id).lean();
    req.flash('success_msg', 'Tarea eliminada éxitosamente.')
    res.redirect('/tasks');
});

module.exports = router;
