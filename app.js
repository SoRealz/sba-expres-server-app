// app.js
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const users = require('./data/users');
const imagesRouter = require('./routes/images');
const imageDetailsRouter = require('./routes/imageDetails');
const handleErrors = require('./middlewares/errorMiddleware');
const versionHeader = require('./middlewares/versionHeader');
const customHeaderMiddleware = require('./middlewares/customHeaderMiddleware');
const maintenanceMiddleware = require('./middlewares/maintenanceMiddleware');


const Router = require('./routes/posts');



const app = express(); 


// Custom middleware for logging requests
app.use(versionHeader);
app.use(customHeaderMiddleware);


// Use body-parser middleware to parse form data
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json({ extended: true }));

// Set up Pug as the view engine
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// serving maintenance middleware
app.use(maintenanceMiddleware);

// Routes For Pug View
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/posts', usersRouter);
app.use('/images', imagesRouter);
app.use('/details', imageDetailsRouter);


// Routes for JSON Data
app.use('/api', indexRouter);
app.use('/api', usersRouter);
app.use('/api', usersRouter);
app.use('/api', usersRouter);
app.use('/api', imagesRouter);
app.use('/api', imageDetailsRouter);



// Use the error-handling middleware
app.use(handleErrors);


// Start the server
const PORT = process.env.PORT || 4001;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});


//this one is working//POST will add using PostMan//

app.post("/users", (req, res) => {
    // Within the POST request route, we create a new user with the data given by the client.
    // We should also do some more robust validation here, but this is just an example for now
    if (req.body.name && req.body.username && req.body.email) {
      if (users.find((u) => u.username == req.body.username)) {
        res.json({ error: `${u.username} already exists` });
        return;
      }
  
      const newUser = {
        id: users[users.length - 1].id + 1,
        name: req.body.name,
        username: req.body.username,
        email: req.body.email,
      };
  
      users.push(newUser);
      res.json(users[users.length - 1]);
    } else {
      res.json({ error: `Insufficient Data` });
    }
  });

  app.delete('/users/:id', (req, res) => {
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



// GET route for retrieving users with query parameter filtering
app.get('/users', (req, res) => {
  let filteredUsers = [...users]; // Create a copy of users array to preserve original data
  
  // Check if query parameters are present
  if (req.query.username) {
      // Filter users by username if provided in query parameters
      filteredUsers = filteredUsers.filter(user => user.username === req.query.username);
  }
  
  // You can add more conditions to filter based on other query parameters like name, email, etc.
  // For example:
  // if (req.query.name) {
  //     filteredUsers = filteredUsers.filter(user => user.name === req.query.name);
  // }

  // Respond with filtered users
  res.json(filteredUsers);
});
