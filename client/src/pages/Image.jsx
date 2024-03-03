import React, { useState, useEffect } from 'react';
import axios from 'axios';


const Image = () => {

    const [image, setImage] = useState(null);
    const [extractedText, setExtractedText] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [d2, setData2] = useState('');

    useEffect(() => {
        const fetchImageData = async () => {
          try {
            const response = await axios.get('http://localhost:8800/data');
            console.log(response);
            if (!response.status === 200) {
              throw new Error('Failed to fetch image data.');
            }
           
            const j = response.data;
          
            console.log(j)
            setData2(j);
            // Decode base64 image
            const decodedImage = 'data:image/jpeg;base64,' + j.image;
            setImage(decodedImage);
            setExtractedText(j.text);
          } catch (error) {
            setErrorMessage(error.message);
          }
        };
    
        fetchImageData();
      }, []); // Empty dependency array to run only once on component mount


      return (
        <div>
            <h2> Image </h2>
          {image && <img src={image} alt="Uploaded" style={{ maxWidth: '300px' }} />}
          <h2> Extracted text </h2>
          {extractedText && <p>{extractedText}</p>}
          {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
          
        </div>
      );
    }


export default Image