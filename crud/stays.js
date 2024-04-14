const express = require('express');
const cors = require('cors')
const admin = require('../firebase')

const stays = express()
stays.use(cors({origin: true}))

db = admin.firestore()

stays.post('/createStay', async (req, res) => {
  let ref = await db.collection('stays').add(req.body)
  let newStayModel = {
    ...req.body,
    id: ref.id
  }
  console.log(ref.id)
  console.log(newStayModel)
  // Update with newStayModel

  db.collection('stays').doc(ref.id).update(newStayModel)
  
  //Get host associated with query
  hostID = req.body.hostID;
  //console.log(hostID)
  hostDoc = await db.collection('users').doc(hostID).get();
  host = hostDoc.data();
  //console.log(host);
  host.stays.push(newStayModel);

  await db.collection('users').doc(hostID).update(JSON.parse(JSON.stringify(host)));
})

// Read all documents
stays.get('/getStays', (req, res) => {
  db.collection('stays').get()
    .then(snapshot => {
      const items = [];
      snapshot.forEach(doc => items.push({ id: doc.id, ...doc.data() }));
      res.status(200).json(items);
    })
    .catch(error => res.status(500).json({ error: error.message }));
});

// Read a single document
stays.get('/getStay', (req, res) => {
  const itemId = req.body.id;
  db.collection('stays').doc(itemId).get()
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
stays.put('/updateStay', (req, res) => {
  const itemId = req.body.id;
  const updatedItem = req.body;
  db.collection('stays').doc(itemId).update(updatedItem)
    .then(() => res.status(200).json({ message: 'Item updated successfully' }))
    .catch(error => res.status(500).json({ error: error.message }));
});

// Delete a document
stays.delete('/deleteStay', (req, res) => {
  const itemId = req.body.id;
  db.collection('stays').doc(itemId).delete()
    .then(() => res.status(200).json({ message: 'Item deleted successfully' }))
    .catch(error => res.status(500).json({ error: error.message }));
});

exports.stays = stays





