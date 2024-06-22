const express = require('express')
const multer  = require('multer')
var docxConverter = require('docx-pdf');
const app = express()
const port = 3000
const path = require("path");

app.use(cors());

//setting up the file stroage
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'uploads')
    },
    filename: function (req, file, cb) {
       cb(null, file.originalname)
    }
  });
  
  const upload = multer({ storage: storage });

  app.post('/convertFile', upload.single('file'), (req, res, next)=> {

    try{
        if(!req.file)
            { 
                return res.status(400).json({
                    message:"No file uploaded",
                });
            }

            //defining output path
            let outpath = path.join(__dirname,"files", `${req.file.originalname}.pdf`);
        docxConverter(req.file.path,outpath,(err,result)=>{
            if(err){
              console.log(err);
              return res.status(500).json({
                  message: "Error converting docx to pdf",
              });
            }
            res.download(outpath,()=>{
              console.log("file downloaded");

            });
          });

    }catch(error){
        console.log(error)
        res.status(500).json({
          message:"Internal Server Error",
        })
    }
   
  });


app.listen(port, () => {
  console.log(`Server listening on port ${port}`)
})