import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import bcrypt from "bcrypt";


import { supabase } from './db/supabaseClient.js';
import multer from 'multer'

const saltRounds = 10;

const upload = multer({ storage: multer.memoryStorage() })

// create the app
const app = express()
// it's nice to set the port number so it's always the same
app.set('port', process.env.PORT || 3000);
// set up some middleware to handle processing body requests
app.use(express.json())
// set up some midlleware to handle cors
app.use(cors())

//removes clothing item from the database
app.delete('/clothing/item/:id', async (req, res) => {
  const { id } = req.params
  const {error} = await supabase
    .from('clothing_items')
    .delete()
    .eq('id', id)

  if (error) return res.status(500).json({ error: error.message })
    res.status(200).json({message: 'Deleted'})
})

//updates saved_for_day for clothing item
app.put('/clothing/item/:id', async (req, res) => {
  const { id } = req.params
  const { saved_for_day } = req.body

  const{ error } = await supabase
    .from('clothing_items')
    .update({ saved_for_day })
    .eq('id', id)

    if (error) return res.status(500).json({ error: error.message })
    res.status(200).json({message: 'Updated'})
})

app.get('/users', async (req, res) => {
  const { data, error } = await supabase
    .from('users')
    .select('*');

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  res.json(data);
});

app.post('/user', async (req, res) => {
  console.log('BODY:', req.body)
  try {
    const {
      username,
      password,
    } = req.body

    console.log(username)
    console.log(password)

    const hashedPassword = await bcrypt.hash(password, saltRounds);


    // Insert into DB
    const { data, error } = await supabase
      .from('users')
      .insert([
        {
          username: username,
          password_hash: hashedPassword
        }
      ]);

    

    if (error) {
      console.error('ERROR:', error.message)
      return res.status(500).json({ error: error.message })
    }

    res.status(201).json([])
  } catch (err) {
    res.status(500).json({ error: 'Server error' })
  }
})

app.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('username', username)
      .single();

    if (error || !data) {
      return res.status(400).json({ error: 'Invalid username or password' });
    }

    const isMatch = await bcrypt.compare(password, data.password_hash);

    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid username or password' });
    }

    return res.status(200).json({
      message: 'Login successful',
      user: {
        id: data.id,
        username: data.username
      }
    });

  } catch (err) {
    console.error('LOGIN ERROR:', err);
    res.status(500).json({ error: 'Server error' });
  }
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
//user specific clothing
app.get('/clothing/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const {
      weather_type,
      clothing_type,
      saved_for_day
    } = req.query;

    let query = supabase
      .from('clothing_items')
      .select('*')
      .eq('user_id', id);

    if (weather_type) {
      query = query.eq('weather_type', weather_type);
    }

    if (clothing_type) {
      query = query.eq('clothing_type', clothing_type);
    }

    if (saved_for_day) {
      query = query.eq('saved_for_day', saved_for_day);
    }

    const { data, error } = await query;

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

//get random outfit
app.get('/outfit/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { weather_type, saved_for_day } = req.query;

    let query = supabase
      .from('clothing_items')
      .select('*')
      .eq('user_id', id);

    // If weather filter is provided
    if (weather_type) {
      query = query.eq('weather_type', weather_type);
    }

    if (saved_for_day) {
      query = query.eq('saved_for_day', saved_for_day);
    }

    const { data, error } = await query;

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    const outfitMap = {};

    for (const item of data) {
      const type = item.clothing_type;

      // If we don't have this type yet, take it
      if (!outfitMap[type]) {
        outfitMap[type] = item;
      }
    }

    const outfit = Object.values(outfitMap);

    res.json(outfit);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
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
  
  
