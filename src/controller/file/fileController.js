/**
 * Handle file uploads
 */
const uploadFile = (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
      }
      
      const fileUrl = `/uploads/${req.file.filename}`;
      
      res.status(200).json({ 
        message: "File uploaded successfully!", 
        file: {
          ...req.file,
          url: fileUrl
        } 
      });
    } catch (error) {
      console.error("File upload error:", error);
      res.status(500).json({ 
        message: "Error uploading file", 
        error: error.message 
      });
    }
  };
  
  export { uploadFile };