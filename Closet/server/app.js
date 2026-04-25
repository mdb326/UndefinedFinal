import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import bcrypt from "bcrypt";


import { supabase } from './db/supabaseClient.js';
import multer from 'multer'

import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret';

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
app.delete('/clothing/item/:id', requireAuth, async (req, res) => {
  const { id } = req.params;

  const { error } = await supabase
    .from('clothing_items')
    .delete()
    .eq('id', id)
    .eq('user_id', req.user.id);

  if (error) return res.status(500).json({ error: error.message });

  res.json({ message: 'Deleted' });
});

//updates saved_for_day for clothing item
app.put('/clothing/item/:id', requireAuth, async (req, res) => {
  const { id } = req.params;
  const { saved_for_day } = req.body;

  const { error } = await supabase
    .from('clothing_items')
    .update({ saved_for_day })
    .eq('id', id)
    .eq('user_id', req.user.id);

  if (error) return res.status(500).json({ error: error.message });

  res.json({ message: 'Updated' });
});

function requireAuth(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ error: 'Missing token' });
  }

  const token = authHeader.replace('Bearer ', '');

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = { id: Number(decoded.id) };
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid token' });
  }
}

async function requireAdmin(req, res, next) {
  const { data, error } = await supabase
    .from('users')
    .select('is_admin')
    .eq('id', req.user.id)
    .single();

  if (error || !data) {
    return res.status(500).json({ error: 'User lookup failed' });
  }

  if (!data.is_admin) {
    return res.status(403).json({ error: 'Admins only' });
  }

  next();
}

app.get('/users', requireAuth, requireAdmin, async (req, res) => {
  const { data, error } = await supabase
    .from('users')
    .select(
      `*,
      clothing_items(count)`
    );

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  res.json(data);
});

app.post('/users/:id/promote', requireAuth, requireAdmin, async (req, res) => {
  const { id } = req.params;

  const { data, error } = await supabase
    .from('users')
    .update({ is_admin: true })
    .eq('id', Number(id))
    .select()
    .single();

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  if (!data) {
    return res.status(404).json({ error: 'User not found' });
  }

  res.json({
    message: 'User promoted to admin',
    user: data
  });
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

    const token = jwt.sign(
      { id: data.id },
      JWT_SECRET,
      { expiresIn: '1h' }
    );

    return res.json({
      token,
      user: {
        id: data.id,
        username: data.username,
        is_admin: data.is_admin
      }
    });

  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

app.get('/clothing', requireAuth, async (req, res) => {
  try {
    const {
      weather_type,
      clothing_type,
      saved_for_day
    } = req.query;

    let query = supabase
      .from('clothing_items')
      .select('*')
      .eq('user_id', req.user.id);

    if (weather_type) {
      query = query.contains('weather_type', [weather_type]);
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
    res.status(500).json({ error: 'Server error' });
  }
});
//user specific clothing
app.get('/clothing/:id', requireAuth, requireAdmin, async (req, res) => {
  const { id } = req.params;

  if (req.user.id !== Number(id)) {
    return res.status(403).json({ error: 'Forbidden' });
  }

  const { data, error } = await supabase
    .from('clothing_items')
    .select('*')
    .eq('user_id', id);

  if (error) return res.status(500).json({ error: error.message });

  res.json(data);
});

//get random outfit
app.get('/outfit', requireAuth, async (req, res) => {
  try {
    const { weather_type, saved_for_day } = req.query;

    let query = supabase
      .from('clothing_items')
      .select('*')
      .eq('user_id', req.user.id);

    if (weather_type) {
      query = query.contains('weather_type', [weather_type]);
    }

    if (saved_for_day) {
      query = query.eq('saved_for_day', saved_for_day);
    }

    const { data, error } = await query;

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    // Build outfit (one per clothing type)
    const outfitMap = {};

    for (const item of data) {
      if (!outfitMap[item.clothing_type]) {
        outfitMap[item.clothing_type] = item;
      }
    }

    res.json(Object.values(outfitMap));

  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});


app.post('/clothing', requireAuth, upload.single('image'), async (req, res) => {
  try {
    const {
      name,
      weather_type,
      clothing_type,
      saved_for_day
    } = req.body;

    let picture_url = null;

    // make sure weather types are in an array
    let weatherTypesArray
    if(!weather_type){
      weatherTypesArray = []
    }
    else if(Array.isArray(weather_type)){
      weatherTypesArray = weather_type
    }
    else{
      weatherTypesArray = [weather_type]
    }

    if (req.file) {
      const fileExt = req.file.originalname.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('clothing-images')
        .upload(fileName, req.file.buffer, {
          contentType: req.file.mimetype
        });

      if (uploadError) {
        return res.status(500).json({ error: uploadError.message });
      }

      const { data } = supabase.storage
        .from('clothing-images')
        .getPublicUrl(fileName);

      picture_url = data.publicUrl;
    }

    const { data, error } = await supabase
      .from('clothing_items')
      .insert([{
        user_id: req.user.id, 
        name,
        weather_type: weatherTypesArray,
        clothing_type,
        saved_for_day,
        picture_url
      }])
      .select()
      .single();

    if (error) return res.status(500).json({ error: error.message });

    res.status(201).json(data);
  } catch {
    res.status(500).json({ error: 'Server error' });
  }
});



app.listen(app.get('port'), () => {
    console.log('App is running at http://localhost:%d in %s mode', app.get('port'), app.get('env'));
    console.log('  Press CTRL-C to stop\n');
  });
  
  
