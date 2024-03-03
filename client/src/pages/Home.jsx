import React, { useState } from 'react';
import { Link } from "react-router-dom";
import axios from 'axios';


const Home = () => {

    const [selectedFile, setSelectedFile] = useState(null);

    
    const handleFileChange = (event) => {
        setSelectedFile(event.target.files[0]);
    };
    
    const handleUpload = async () => {
        // You can implement your upload logic here, such as sending the file to a server
        // For simplicity, let's just log the file object to the console
        if (!selectedFile) {
          alert('Please select a file');
          return;
        }

        const formData = new FormData();
        formData.append('image', selectedFile);

        try {
          const response = await axios.post('http://localhost:8800/image', formData, {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
          });
          console.log('Image uploaded successfully:', response.data);
        } catch (error) {
          console.error('Error uploading image:', error);
        }

        console.log(selectedFile);
    };
    return (
        <div>
      <h2>Image Uploader</h2>
      <input type="file" accept="image/*" onChange={handleFileChange} />
      <Link to={`/image`}>
      <button onClick={handleUpload} disabled={!selectedFile}>
        Upload
      </button>
      </Link>
      {selectedFile && (
        <div>
          <h4>Selected Image:</h4>
          <img src={URL.createObjectURL(selectedFile)} alt="Selected" style={{ maxWidth: '100%', maxHeight: '1200px' }} />
        </div>
      )}
    </div>
    );
}

export default Home