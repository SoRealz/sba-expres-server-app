
const express = require('express');
const router = express.Router();
const users = require('../data/users');

const baseURL = 'http://localhost:4001';

router.get('/users', (req, res) => {
    
    const usersWithLinks = users.map(user => {
        return {
            ...user,
            links: [
                { rel: 'self', href: `${baseURL}/api/users/${user.id}` },
            ],
        };
    });

    res.json({ users: usersWithLinks });
});

// GET a specific user by ID with HATEOAS links
router.get('/users/:id', (req, res) => {
    const userId = parseInt(req.params.id);
    const user = users.find(u => u.id === userId);

    if (!user) {
        return res.status(404).json({ error: 'User not found' });
    }

    const userWithLinks = {
        ...user,
        links: [
            { rel: 'self', href: `${baseURL}/api/users/${user.id}` },
        ],
    };

    res.json(userWithLinks);
});


// Render User Pug view
router.get('/', (req, res) => {
    // Adding HATEOAS links to each user
    const usersWithLinks = users.map(user => {
        return {
            ...user,
            links: [
                { rel: 'self', href: `${baseURL}/users/${user.id}` },
                { rel: 'details', href: `${baseURL}/users/${user.id}/details` },
            ],
        };
    });





    
    // Adding a link to the current resource (users)
    const selfLink = { rel: 'self', href: `${baseURL}/users` };

    // Constructing the response object
    const response = {
        title: 'Index of',
        users: usersWithLinks,
        links: [selfLink],
    };

    res.render('users', response);
});

router.post('/', (req, res) => {
    const { name, username, email } = req.body;
    
    // Check if all required fields are present
    if (!name || !username || !email) {
        return res.status(400).json({ error: 'Insufficient Data: needs name, username, and email' });
    }

    // Check if username already exists
    if (users.some(u => u.username === username)) {
        return res.status(400).json({ error: `Username already exists: ${username}` });
    }

    // Create a new user
    const newUser = {
        id: users.length > 0 ? users[users.length - 1].id + 1 : 1,
        name,
        username,
        email
    };

    users.push(newUser);
    console.log(`Successfully added new user: ${newUser.id}, ${newUser.name}, ${newUser.username}, ${newUser.email}`);
    
    res.status(201).json(newUser);
});


router.delete('/:id', (req, res) => {
    const userId = parseInt(req.params.id);

    // Find the index of the user with the specified ID
    const userIndex = users.findIndex(u => u.id === userId);

    if (userIndex !== -1) {
        // Remove the user from the array
        const deletedUser = users.splice(userIndex, 1)[0];
        console.log(`Successfully deleted user: ${deletedUser.id}, ${deletedUser.name}, ${deletedUser.username}, ${deletedUser.email}`);
        
        // Respond with the deleted user
        res.status(200).json(deletedUser);
    } else {
        // Respond with an error if user with the specified ID is not found
        res.status(404).json({ error: `User with ID ${userId} not found` });
    }
});


module.exports = router;

