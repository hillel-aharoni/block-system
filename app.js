const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');


dotenv.config();
const app = express();

app.use(express.json());


// Routes
app.use('/api', require('./routes/authRoutes'));
app.use('/api/posts', require('./routes/postRoutes'));
app.use('/api/users', require('./routes/userRoutes'));




// DB connect
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    app.listen(3000, () =>
      console.log(`Server running on http://localhost:${3000}`)
    );
  })
  .catch(err => console.error(err));
