const app = require('./app'); // Import the app from app.js
const port = 9000;

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
