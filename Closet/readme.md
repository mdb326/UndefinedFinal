[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-22041afd0340ce965d47ae6ef1cefeee28c7c493a6346c4f15d667ab976d596c.svg)](https://classroom.github.com/a/abj0kIfG)
# CSE264 Project 9: Building a Job Application Tracker
## Due: Monday, April 13, 2026 at 11:59 PM
## Add your full name and Lehigh email address to this README!

Matthew Bergin
mdb326@lehigh.edu


Build a full-stack web application to manage job applications using React, Express.js, and PostgreSQL. This project will create an interface that allows users to track job applications, update their status, and optionally include notes.  Feel free to use the [Material UI Component Library](https://mui.com/material-ui/) and the [Material React Table](https://www.material-react-table.com/) library.

### Project Requirements
Your web application should have/do the following:

* Add New Job Application
    * Users must be able to fill out a form to add a job application
    * Fields include: Company Name, Position Title, Status (i.e. Applied, Interviewing, Offer, Rejected, etc.), Optional Notes, and Date Applied
    * Status should be selected from a drop down list, Date Applied should be from a date picker, and the rest should be free text
* View All Job Applications
    * Users should see a list or table of all job applications
    * Each Job should show all the relevent fields
    * List/Table should automatically update after adding a new job
* Update Existing Job Applications
    * User should be able to update the job status and notes
    * Optionnally allow editing the position or company name
* Delete Job Application
    * Include a delete button for each job
    * Promp confirmation before deletion
* Backend
  * Build a RESTful API with endpoints:
    * GET -- `/jobs`
    * POST -- `/jobs`
    * PUT -- `/jobs/:id`
    * DELETE -- `/jobs/:id`
* Styling and UX
  * Use basic styling to distinguish between statuses
  * Form should validate all required fields
  * Additional styling and animations for better user experience


### Installation and Running the Project

#### Client
The client for this project uses React + Vite template which provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

You must have node.js running on your machine. Once you have cloned this project you can run `npm install` to install all the packages for this project. Then running `npm run dev` will run the dev version of this code, which will run this project on localhost:5173 (or at the location specified in the console).

#### Server
You must have node.js running on your machine. Once you have cloned this project you can run `npm install` to install all the packages for this project. Then running `npm run dev` will run the dev version of this code, which will run this project with nodemon. Nodemon auto-restarts the node server every time you make a change to a file. This is very helpful when you are writing and testing code.

##### .env and Postgres Installation

A Postgres instance has been provided to you. Your username for the database is your 6 character alphanumeric lehigh id. Your password for the database is your 6 character alphanumeric lehigh id followed by '_lehigh'.

You will need to create a .env from the .env.example You can do this by running this line of code in your terminal 

`cp .env.example .env`

Then store your Database credentials in your .env file.

**Note: Never EVER push private information (like credentials) to a Git Repo. We use .env to store this connection information and ensure that git (using .gitignore) never pushes this private information in the repo. Never ever store real credentials in .env.example or anywhere that is not .env as you may push these changes to your git repo.**



### Grading
* **Add Job Functionality** -- **15 points** -- Job form works, adds to DB, and refreshes jobs
* **View Job List/Table** -- **15 points** -- Displays jobs correctly from the backend
* **Update Functionality** -- **15 points** -- Update job status or notes and reflects in the UI and DB
* **Delete Functionality** -- **15 points** -- Jobs can be deleted and the UI and DB updates
* **API Design** -- **15 points** -- RESTFUL, error handling, and integrated with client
* **Styling and UX** -- **10 points** -- Different job statuses are distinguished, validation is applied to data entries
* **Overall Functionality** -- **15 points** -- The Applications works as intended without any major bugs.

**If code doesn't run/compile you can get no more than a 60. But please write comments and a README to explain what you were trying to do.**
