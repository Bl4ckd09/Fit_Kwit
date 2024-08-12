This is my github repository for Database and Web coursework.


<How to set up Fit_Kwit>

  1. Prerequisites
     
     1.1 Install Node.js and npm

sudo apt-get update
sudo apt-get install nodejs npm -y

    1.2. Install MySQL

sudo apt-get install mysql-server -y
sudo mysql_secure_installation
mysql -u root -p
CREATE DATABASE fit_kwick;
exit

    1.3. Install Git

sudo apt-get install git -y
git --version

  
2. Project Setup
   
  2.1. clone this repo

git clone https://github.com/yourusername/fit-kwick.git
cd fit-kwick

  2.2. Install 

npm init
npm install express ejs passport passport-local express-session bcryptjs connect-flash

  2.3. Set Up the Database
  
mysql -u appuser -p
mysql> source /fit-kwick/create_db.sql;
mysql> source /path/to/your/fit-kwick/insert_data.sql;


3. Config

server file: /fit_kwit/app2.js
route file: /fit_kwit/routes/main3.js 
HTML: /fit_kwit/views/
CSS: /fit_kwit/public/styles.css


4. Start

npm start

