const inquirer = require('inquirer')
const mysql = require('mysql2')
const consoleTable = require('console.table')

const db = mysql.createConnection(
    {
        host: 'localhost',
        user: 'root',
        password: '',
        database: 'employees_db',
    },
    console.log(`Connected to the employee database.`)
)

db.query('SELECT * FROM employees', function (err, results) {
    console.log(results);
})

// Questions

"What would you like to do?"

"View Employees",
"View Employees by Department",
"Add Employee",
"Remove Employee",
"Update Employee Role",
"Add Role",
"End"

"What is the name of the department?"
"What is the name of the role?"
"What is the employee's first name?"
"What is the employee's last name?"
"What is the employee's role?"
"Who is the employee's manager?"

"Which employee's role do you want to update?"

function init() {
}

init()