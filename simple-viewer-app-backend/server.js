const express = require('express');
const { PORT } = require('./config.js');
const cors = require('cors');



let app = express();

// Use the cors middleware
app.use(cors());


app.use(express.static('wwwroot'));
app.use(require('./routes/auth.js'));
app.use(require('./routes/models.js'));
app.listen(PORT, function () { console.log(`Server listening on port ${PORT}...`); });

