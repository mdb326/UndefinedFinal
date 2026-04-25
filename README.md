#MyDigitalCloset <br>
Digital wardrobe app the helps the users decide what outfit to put on for the day. The user uploads their clothes, can filter by description, and gets the recommendation based on the weather in the area. 


##Team Members: <br>
-Dane Song - Developed the frontend <br>
-Matthew Bergin - Developed the backend <br>
-Ryan Chrostowski - Integration and adding features <br>


##App Features: <br>
User Accounts: <br>
-The users can sign up with a username and a password. The passwords are actually hashed. The accounts have either a standard role or admin role. The admins can view all the users and promote other users to the admin role in the Admin Panel 


##Database: <br>
-User information and their clothing are stored in the Supabase database.

##Interactive UI <br>
-React and Material UI <br>
-Image upload to add clothing <br>
-Ability to filter the wardrobe by clothing type and weather type <br>
-Delete items in your closet <br>
-Generate outfit based on the weather in the user’s current location <br>
-Plan out the outfits for the next 7 days on a weekly basis <br>


##New Library/Framework <br>
Additional Material UI features- many components use buttons, modals, dropdowns, cards, date picker, and grids. <br>


##Rest API 
POST		/user		creates a new user
POST		/login		log in for user
GET		/clothing	get the current user’s clothing
POST		/clothing	add new clothing item
PUT		/clothing/item/:id	update clothing item
DELETE	/clothing/item/:id	delete clothing item
GET		/users			Get all the users
GET		/users/:id/promote	Gets all the users
POST		/users/:id/promote	Admin can promote a user


##External Rest API<br>
The National Weather Service API is used to get the real time weather for the location that the user is in. It gets the user’s coordinates and then passes that to api.weather.gov to get the current temperature. This is then mapped in the app to either hot, warm, cool, or cold. 


##Installation <br>
Node..js<br>
Supabase Project<br>

###Clone the repository <br>
git clone https://github.com/mdb326/UndefinedFinal.git <br>
cd UndefinedFinal/Closet<br>

###Set up the server<br>
cd server<br>
npm install<br>

###Create a .env file in /server<br>
SUPABASE_URL=your_supabase_project_url<br>
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key<br>

###Start the server<br>
Node app.js or npm run dev<br>

###Setup the client <br>
cd ../client <br>
npm install <br>
npm run dev <br>

The app will appear at http://localhost:5173 <br>

###Supabase Setup: <br>
In Supabase website run the SQL in SQL editor <br>
CREATE TABLE users ( <br>
  id SERIAL PRIMARY KEY,<br>
  username VARCHAR(50) UNIQUE NOT NULL,<br>
  password_hash TEXT NOT NULL,<br>
  is_admin BOOLEAN DEFAULT FALSE<br>
);<br>

CREATE TABLE clothing_items (<br>
  id SERIAL PRIMARY KEY,<br>
  user_id INTEGER NOT NULL,<br>
  name VARCHAR(100) NOT NULL,<br>
  picture_url TEXT,<br>
  weather_type TEXT[],<br>
  clothing_type VARCHAR(50),<br>
  saved_for_day DATE,<br>
  CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE<br>
);<br>
<br>
Create a bucket to store clothing and users <br>
Put the URL and Key in the .env file <br>

###National Weather Service API <br>
This API is public and free to use, so no API key is required <br>
