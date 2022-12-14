import express from 'express';
import bodyParser from 'body-parser';
import {filterImageFromURL, deleteLocalFiles} from './util/util';
import {isImage} from './util/helper';

(async () => {

  // Init the Express application
  const app = express();

  // Set the network port
  const port = process.env.PORT || 8082;
  
  // Use the body parser middleware for post requests
  app.use(bodyParser.json());

  app.get( "/filteredimage", async ( req:express.Request, res:express.Response ) => {
    const query = req.query;
    const image_url:string = query.image_url;
    let files:any = [];
    if(!image_url){
     return res.status(404).send("image path not found")
    }
    const is_image = await isImage(image_url);
    if(!is_image){
      return  res.status(403).send("Image path must be a valid image url")
    }
    await filterImageFromURL(image_url).then((image_link)=>{
        res.sendFile(image_link,function(){
          files.push(image_link)
           deleteLocalFiles(files);
        })
        
        // deleteLocalFiles(files);
    }).catch(err=>{
      res.status(422).send('Could not process image')
    })
  
    // console.log(filteredImage);
    // res.send("try GET /filteredimage?image_url={{}}")
  } );
  
  // @TODO1 IMPLEMENT A RESTFUL ENDPOINT
  // GET /filteredimage?image_url={{URL}}
  // endpoint to filter an image from a public url.
  // IT SHOULD
  //    1
  //    1. validate the image_url query
  //    2. call filterImageFromURL(image_url) to filter the image
  //    3. send the resulting file in the response
  //    4. deletes any files on the server on finish of the response
  // QUERY PARAMATERS
  //    image_url: URL of a publicly accessible image
  // RETURNS
  //   the filtered image file [!!TIP res.sendFile(filteredpath); might be useful]

  /**************************************************************************** */

  //! END @TODO1
  
  // Root Endpoint
  // Displays a simple message to the user
  app.get( "/", async ( req, res ) => {
    res.send("try GET /filteredimage?image_url={{}}")
  } );
  

  // Start the Server
  app.listen( port, () => {
      console.log( `server running http://localhost:${ port }` );
      console.log( `press CTRL+C to stop server` );
  } );
})();