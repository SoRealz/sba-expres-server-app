
const axios = require('axios');

const userData = {
    name: 'John Doe',
    username: 'johndoe',
    email: 'johndoe@example.com'
};

axios.post('http://localhost:4001/api/users', userData)
    .then(response => {
        console.log('Response:', response.data);
    })
    .catch(error => {
        console.error('Error:', error.response.data);
    });
  
    