const posts = [{ id: 1, name: 'Jacob', username: 'Jayrockid', email: 'jayrockkid@yahoo.com'}];

module.exports = posts;

// POST route to create a new post
app.post('/posts', (req, res) => {
  const newPost = req.body;

  // Add the new post to the posts array
  posts.push(newPost);

  // Respond with the newly created post
  res.status(201).json(newPost);
});


  