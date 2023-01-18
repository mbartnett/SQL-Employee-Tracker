// Basic variables

const inquirer = require('inquirer')
const mysql = require('mysql2')
const consoleTable = require('console.table')

const db = mysql.createConnection(
    {
        host: 'localhost',
        port: 3306,
        user: 'root',
        password: '',
        database: 'employees_db',
    }
)

db.connect(() => {
    console.log(`Connected to the employee database.`)
    init()
}) 

// db.query('SELECT * FROM employees', function (err, results) {
//     console.log(results);
// })

//  ___               _                        __  __                                   
// | __| _ __   _ __ | | ___  _  _  ___  ___  |  \/  | __ _  _ _   __ _  __ _  ___  _ _ 
// | _| | '  \ | '_ \| |/ _ \| || |/ -_)/ -_) | |\/| |/ _` || ' \ / _` |/ _` |/ -_)| '_|
// |___||_|_|_|| .__/|_|\___/ \_, |\___|\___| |_|  |_|\__,_||_||_|\__,_|\__, |\___||_|  
//             |_|            |__/                                      |___/           

// Questions

const questions = [
    {
type: "list",
name: "Selection",
message: "What would you like to do?",
choices: ["View All Employees", "Add Employee", "Update Employee Role", "View All Roles", "Add Role",
 "View All Departments", "Add Department", "Quit"],
    }
]

// "What would you like to do?"

// "View All Employees",
// "Add Employee",
// "Update Employee Role",
// "View All Roles"
// "Add Role",
// "View All Departments",
// "Add Department",
// "Quit"

// "What is the name of the department?"
// "What is the name of the role?"
// "What is the employee's first name?"
// "What is the employee's last name?"
// "What is the employee's role?"
// "Who is the employee's manager?"

// "Which employee's role do you want to update?"

function viewAllDepartments(){
    db.query('SELECT * FROM DEPARTMENT', (err, data) => {
        console.table(data)
        init()
    })
}

function init() {
    inquirer.prompt(questions).then(response =>{
    if(response.Selection === "View All Departments"){
    viewAllDepartments()
    }
})
}

