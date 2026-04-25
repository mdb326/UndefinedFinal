MyDigitalCloset
Digital wardrobe app the helps the users decide what outfit to put on for the day. The user uploads their clothes, can filter by description, and gets the recommendation based on the weather in the area. 


Team Members 
Dane Song - Developed the frontend
Matthew Bergin - Developed the backend 
Ryan Chrostowski - Integration and adding features


App Features
User Accounts
The users can sign up with a username and a password. The passwords are actually hashed. The accounts have either a standard role or admin role. The admins can view all the users and promote other users to the admin role in the Admin Panel 


Database
User information and their clothing are stored in the Supabase database.

Interactive UI 
React and Material UI
Image upload to add clothing
Ability to filter the wardrobe by clothing type and weather type
Delete items in your closet
Generate outfit based on the weather in the user’s current location 
Plan out the outfits for the next 7 days on a weekly basis 


New Library/Framework 
Additional Material UI features- many components use buttons, modals, dropdowns, cards, date picker, and grids. 


Rest API 
POST		/user		creates a new user
POST		/login		log in for user
GET		/clothing	get the current user’s clothing
POST		/clothing	add new clothing item
PUT		/clothing/item/:id	update clothing item
DELETE	/clothing/item/:id	delete clothing item
GET		/users			Get all the users
GET		/users/:id/promote	Gets all the users
POST		/users/:id/promote	Admin can promote a user


External Rest API
The National Weather Service API is used to get the real time weather for the location that the user is in. It gets the user’s coordinates and then passes that to api.weather.gov to get the current temperature. This is then mapped in the app to either hot, warm, cool, or cold. 


Installation 
Node..js
Supabase Project

Clone the repository 
git clone https://github.com/mdb326/UndefinedFinal.git 
cd UndefinedFinal/Closet

Set up the server
cd server
npm install

Create a .env file in /server
SUPABASE_URL=your_supabase_project_url
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

Start the server
Node app.js or npm run dev

Setup the client 
cd ../client
npm install
npm run dev

The app will appear at http://localhost:5173

Supabase Setup: 
In Supabase website run the SQL in SQL editor 
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(50) UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  is_admin BOOLEAN DEFAULT FALSE
);

CREATE TABLE clothing_items (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL,
  name VARCHAR(100) NOT NULL,
  picture_url TEXT,
  weather_type TEXT[],
  clothing_type VARCHAR(50),
  saved_for_day DATE,
  CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

Create a bucket to store clothing and users 
Put the URL and Key in the .env file 

National Weather Service API 
This API is public and free to use, so no API key is required 
