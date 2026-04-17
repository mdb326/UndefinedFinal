import express from 'express'
import cors from 'cors'
import 'dotenv/config'


import { supabase } from './db/supabaseClient.js';
import multer from 'multer'

const upload = multer({ storage: multer.memoryStorage() })

// create the app
const app = express()
// it's nice to set the port number so it's always the same
app.set('port', process.env.PORT || 3000);
// set up some middleware to handle processing body requests
app.use(express.json())
// set up some midlleware to handle cors
app.use(cors())


app.get('/users', async (req, res) => {
  const { data, error } = await supabase
    .from('users')
    .select('*');

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  res.json(data);
});

app.get('/clothing', async (req, res) => {
  const { data, error } = await supabase
    .from('clothing_items')
    .select('*');

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  res.json(data);
});



app.post('/clothing', upload.single('image'), async (req, res) => {
  console.log('BODY:', req.body)
    console.log('FILE:', req.file)
  try {
    const {
      user_id,
      name,
      weather_type,
      clothing_type,
      saved_for_day
    } = req.body

    let picture_url = null

    // If image exists → upload to Supabase
    if (req.file) {
      const fileExt = req.file.originalname.split('.').pop()
      const fileName = `${Date.now()}.${fileExt}`

      const { error: uploadError } = await supabase.storage
        .from('clothing-images')
        .upload(fileName, req.file.buffer, {
          contentType: req.file.mimetype
        })

      if (uploadError) {
        console.error('UPLOAD ERROR:', uploadError)
        return res.status(500).json({ error: uploadError.message })
      }

      // Get public URL
      const { data } = supabase.storage
        .from('clothing-images')
        .getPublicUrl(fileName)

      picture_url = data.publicUrl
    }

    // Insert into DB
    const { data, error } = await supabase
      .from('clothing_items')
      .insert([
        {
          user_id,
          name,
          weather_type,
          clothing_type,
          saved_for_day,
          picture_url
        }
      ])
      .select()

    if (error) {
      console.error('ERROR:', error.message)
      return res.status(500).json({ error: error.message })
    }

    res.status(201).json(data[0])
  } catch (err) {
    res.status(500).json({ error: 'Server error' })
  }
})


app.listen(app.get('port'), () => {
    console.log('App is running at http://localhost:%d in %s mode', app.get('port'), app.get('env'));
    console.log('  Press CTRL-C to stop\n');
  });
  