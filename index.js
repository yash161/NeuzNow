// index.js
const express = require('express');
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
const path = require('path');

const app = express();
const port = 4000;

// Load Swagger YAML file
const swaggerDocument = YAML.load(path.join(__dirname, './swagger.yaml'));

// Use Swagger UI for API documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Sample route
app.get('/api/v1/example', (req, res) => {
    res.json({ message: "Hello, this is an example API!" });
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
