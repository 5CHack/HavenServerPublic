const express = require('express');
const cors = require('cors')
const admin = require('../firebase')

const posts = express()
posts.use(cors({origin: true}))

db = admin.firestore()

posts.post('/createPost', async (req, res) => {
  let ref = await db.collection('posts').add(req.body)
  let newPostModel = {
    ...req.body,
    id: ref.id
  }
  console.log(ref.id)
  console.log(newPostModel)
  // Update with newStayModel
  db.collection('posts').doc(ref.id).update(newPostModel)
  .then(() => res.status(200).json({ message: 'Item updated successfully' }))
  .catch(error => res.status(500).json({ error: error.message }));
  
  res.status(200).send('Success pt 1!')
})

// Read all documents
posts.get('/getPosts', (req, res) => {
  db.collection('posts').get()
    .then(snapshot => {
      const items = [];
      snapshot.forEach(doc => items.push({ id: doc.id, ...doc.data() }));
      res.status(200).json(items);
    })
    .catch(error => res.status(500).json({ error: error.message }));
});

// Read a single document
posts.get('/getPost', (req, res) => {
  const itemId = req.body.id;
  db.collection('posts').doc(itemId).get()
    .then(doc => {
      if (!doc.exists) {
        res.status(404).json({ error: 'Item not found' });
      } else {
        res.status(200).json({ id: doc.id, ...doc.data() });
      }
    })
    .catch(error => res.status(500).json({ error: error.message }));
});

// Update a document
posts.put('/updatePost', (req, res) => {
  const itemId = req.body.id;
  const updatedItem = req.body;
  db.collection('posts').doc(itemId).update(updatedItem)
    .then(() => res.status(200).json({ message: 'Item updated successfully' }))
    .catch(error => res.status(500).json({ error: error.message }));
});

// Delete a document
posts.delete('/deletePost', (req, res) => {
  const itemId = req.body.id;
  db.collection('posts').doc(itemId).delete()
    .then(() => res.status(200).json({ message: 'Item deleted successfully' }))
    .catch(error => res.status(500).json({ error: error.message }));
});

exports.posts = posts