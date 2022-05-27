# CF_Finder

## AlgoZenith Hackathon Submission

Name: Ujwal Nitin Nayak &emsp; &emsp; Display Name on AZ: decryptr &emsp; &emsp; &emsp; Batch: AZ201B8

### Instructions to build the app locally:

1. In the GitHub repository click on Code -> Download ZIP. The files will start downloading. Once the download is complete, unzip the compressed file and move the folder to a destination of your choice.
2. Launch Visual Studio Code (or any equivalent code editor). Go to File -> Open Folder and choose the directory in which the files were stored.
3. Open a terminal instance (Terminal -> New Terminal) and type "npm install". This will install all the dependencies.
4. Once the installation is complete, type "nodemon app.js" in the terminal. If the terminal displays "Connected to DB", you have successfully started up the app server on port 3000 and have connected to MongoDB.
5. Finally, open up a browser and in the address bar, type "http://localhost:3000/".

Note:

1. Based on the OS you are using you **may** need to make modifications in the split function arguments in lines 13-15 in app.js. For example, if the query "array" is giving no results then modify the separator to the one appropriate for your OS: https://stackoverflow.com/questions/15433188/what-is-the-difference-between-r-n-r-and-n .
2. Heroku Link: https://cf-finder-app.herokuapp.com/
3. The app is not mobile-compatible.
