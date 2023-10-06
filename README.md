# Team Time Off
Time off request scheduler
Created by Nick Bowden

The purpose of this project was to sharpen my full-stack skills through a simulated real-world project. I wanted to explore using some new tools, such as the suite of tools from Firebase, and to build an application that could solve an internal business problem. 

The scenario for this application is that there is a small team that needs a better way to manage time off requests as the team currently handles it manually. They need a way to make and manage requests, which will be approved by managers, and will display approved request days so that everyone can plan.

## Demo 
In order to see the full calendar and interact with the application, you will need to log in.

Use these credentials to log in to the guest account. 

**Email**: janice.lorenzo[]()@mail.com  \
**Password**: hunter2

This account has manager privileges so that all features can be seen.

Try it live: https://team-time-off.vercel.app/

## Installation
Clone the repo 

```git clone https://github.com/nbowd/team-time-off.git```
### Backend
You will need to create a new Firebase project in order to run this application on a local machine.
1. Login/Create Account on Firebase. Add new project from the [Console](https://console.firebase.google.com/u/0/).
2. From within the new project: enable/create Firestore Database, Authentication, and Storage features.
3. Generate a New Private Key: Goto the "Project Settings" of the Firebase project, then to the "Service accounts" tab. Here, you'll see an option to generate a new private key. When you click on this button, Firebase will generate a new private key and download it as a .json file.
4. Create a `.env` file in the root directory and create an environment variable called `VITE_FIREBASE_INFO`.
5. Copy the contents of the downloaded .json file and set the assign this information to the `VITE_FIREBASE_INFO` environment variable.

### Frontend
1. Install the NPM packages

    ```npm install```
2. Start the development server
   
    ```npm run dev```

## Tech Used
This project uses the following technologies:
- **Backend**: Firebase, specifically:
    - Firestore for the database
    - Firebase Authentication for user authentication
    - Firebase Storage for file storage

- **Frontend**: 
  - React
  - TypeScript
  - Vite
- **Other Technologies**: 
  - date-fns package for easy date management
  - chart.js for charting
  - MUI for a specialty dropdown
  - Figma for UI prototype
  - Asana for planning/roadmap

## Development Process
  * Planned general features and roadmap using a kanban board (Asana)
  * Designed frontend using Figma
  * Setup Firebase and experimented with features. This was a new technology for me, so I was learning the basics.
  * Setup frontend using Vite
  * Began development

Challenges: 

I was initially struggling with the frontend portion of the calendar and trying to neatly display each month. I planned to include only the days of the current month, but this often left uneven gaps in the first and last rows due to where the start of the month fell. After some research, I found some of the functions provided by the `date-fns` package would help me retrieve the dates for the start of the week and end of the week so that I could display full rows. This greatly improved the consistency of the application and provided smooth experience switch the calendar between months.
## Feature Wishlist and Coming Soon
 - Automated testing, most likely using Cypress
 - Expand scope to allow users to create an instance of this calendar app for each time.
 - Email notifications of request status changes
