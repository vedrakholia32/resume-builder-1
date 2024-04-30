const express = require('express');
const fs = require('fs');
const pdf = require('html-pdf');
const path = require('path');

const app = express();
const port = process.env.PORT || 10000;

app.use(express.static(path.join(__dirname, 'public')));

app.use(express.urlencoded({ extended: true })); // Middleware to parse form data

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Handle form submission and convert HTML to PDF
app.post('/', (req, res) => {
    const name = req.body.name || 'No name provided';
    const phone = req.body.phone || 'No phone provided';
    const email = req.body.email || 'No email provided';
    const address = req.body.address || 'No address provided';
    const jobTitle = req.body.jobTitle || 'No job title provided'
    
    const htmlFilePath = path.join(__dirname, 'resume.html');

    fs.readFile(htmlFilePath, 'utf8', (err, htmlContent) => {
        if (err) {
            return console.error(err);
        }

        // Replace placeholders with form values
        htmlContent = htmlContent
            .replace('{name}', name)
            .replace('{phone}', phone)
            .replace('{email}', email)
            .replace('{address}', address)
            .replace('{jobTitle}', jobTitle);

        const pdfOptions = {
            format: 'Letter'
        };

        // Create PDF from the updated HTML content
        pdf.create(htmlContent, pdfOptions).toBuffer( (err, buffer) => {
            if (err) {
                return console.error(err);
            }
            // console.log(result);
            // Send the generated PDF file to the client
            res.contentType("application/pdf");
            res.send(buffer);
        });
    });
});


app.listen(port, () => {
    console.log(`App listening at http://localhost:${port}`);
});
