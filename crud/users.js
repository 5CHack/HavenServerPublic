const express = require('express');
const cors = require('cors')
const admin = require('../firebase')

const users = express()
users.use(cors({origin: true}))

db = admin.firestore()


users.post('/createUser', async (req, res) => {
  await db.collection('users').doc(req.body.uid).set(req.body)
  res.status(200).send('Success pt 1!')
})

// Read all the users
users.get('/getUsers', (req, res) => {
  db.collection('users').get()
    .then(snapshot => {
      const items = [];
      snapshot.forEach(doc => items.push({ id: doc.id, ...doc.data() }));
      res.status(200).json(items);
    })
    .catch(error => res.status(500).json({ error: error.message }));
});

// Read a single user
users.post('/getUser', (req, res) => {
  const itemId = req.body.id;
  db.collection('users').doc(itemId).get()
    .then(doc => {
      if (!doc.exists) {
        res.status(404).json({ error: 'Item not found' });
      } else {
        res.status(200).json({ id: doc.id, ...doc.data() });
      }
    })
    .catch(error => res.status(500).json({ error: error.message }));
});

// Update a single user
users.put('/updateUser', (req, res) => {
  const itemId = req.body.id;
  const updatedItem = req.body;
  db.collection('users').doc(itemId).update(updatedItem)
    .then(() => res.status(200).json({ message: 'Item updated successfully' }))
    .catch(error => res.status(500).json({ error: error.message }));
});

// Delete a single user
users.delete('/deleteUser', (req, res) => {
  const itemId = req.body.id;
  db.collection('users').doc(itemId).delete()
    .then(() => res.status(200).json({ message: 'Item deleted successfully' }))
    .catch(error => res.status(500).json({ error: error.message }));
});

exports.users = users