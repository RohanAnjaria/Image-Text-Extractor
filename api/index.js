import express from "express"
import {db} from "./db.js"
import multer from "multer"
import path from "path"
import { createWorker } from 'tesseract.js';
import fs from "fs";
import cors from 'cors';

const app = express()

// Use cors middleware to allow requests from frontend
app.use(cors());

app.use(express.json())

// Multer configuration for file upload
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
      cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
  });
  const upload = multer({ storage: storage });

// Serve static files
app.use(express.static('public'));

// Upload endpoint
app.post('/image', upload.single('image'), async (req, res) => {
  if (!req.file) {
    return res.status(400).send('No files were uploaded.');
  }

  // Read the image file
  const imagePath = req.file.path;
  const base64Image = fs.readFileSync(imagePath, { encoding: 'base64' });

  // Initialize Tesseract.js worker
  const worker = await createWorker('eng');

  // Recognize text from the uploaded image

  const { data: { text } } = await worker.recognize(req.file.path);
  console.log('Extracted text:', text);

  // Insert base64 image and extracted text into MySQL database
  const sql = 'INSERT INTO images (image, text) VALUES (?, ?)';
  db.query(sql, [base64Image, text], (error, results) => {
    if (error) {
      console.error('Error storing data in database:', error);
      res.status(500).send('Error storing data in database');
      return;
    }
    console.log('Data stored in database:', results);
  });

  // Terminate the worker after text extraction
  await worker.terminate();

  // Here you can process the uploaded file (e.g., save it to a database, resize it, etc.)
  console.log('File uploaded:', req.file);

  // Send the extracted text and encoded image as response
  res.json({ image: base64Image, text: text });
});

app.get('/data', (req, res) => {
    // Retrieve the image and text data from the database
    const query = 'SELECT image, text FROM images LIMIT 1';
    db.query(query, (error, results) => {
        if (error) {
          console.error('Error retrieving data from database:', error);
          return res.status(500).json({ error: 'Failed to retrieve data from database' });
        }
    
        if (results.length === 0) {
          return res.status(404).json({ error: 'Image data not found' });
        }
    
        // Extract image and text from the database results
        const imageData = results[0].image;
        const extractedText = results[0].text;
    
        // Send the image and text data in the response
        return res.json({ image: imageData, text: extractedText }).status(200);

        // const deleteQuery = 'DELETE FROM images';
        // db.query(deleteQuery, (deleteError, deleteResults) => {
        //     if (deleteError) {
        //       console.error('Error deleting data from database:', deleteError);
        //       // Log the error but do not send a response since the data has already been sent
        //     } else {
        //       console.log('All rows deleted from the images table');
        //     }
        //   });
    });
}
);

app.get('/', (req, res) => {
    res.send('Server is running on port 8800');
  });

app.listen(8800, () => {
    console.log("Connected!")
});