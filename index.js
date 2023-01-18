// Basic variables
const inquirer = require('inquirer')
const mysql = require('mysql2')
const consoleTable = require('console.table')

// MySQL connection
const db = mysql.createConnection({
    host: '127.0.0.1',
    port: 3306,
    user: 'root',
    password: '',
    database: 'employees_db',
})

db.connect((err) => {
    if (err) throw err
    console.log(`Connected to the employee database.`)
    init()
})

// Application Questions
const questions = [
    {
        type: "list",
        name: "Selection",
        message: "What would you like to do?",
        choices: ["View All Employees", "Add Employee", "Update Employee Role", "View All Roles", "Add Role", "View All Departments", "Add Department", "Update Department ID", "Delete Department", "Quit"],
    }
]

// Launch the application
function init() {
    inquirer.prompt(questions).then(response => {
        if (response.Selection === "View All Employees") {
            viewAllEmployees()
        } else if (response.Selection === "Add Employee") {
            addEmployee()
        } else if (response.Selection === "Update Employee Role") {
            updateEmployeeRole()
        } else if (response.Selection === "View All Departments") {
            viewAllDepartments()
        } else if (response.Selection === "Add Department") {
            addDepartment()
        } else if (response.Selection === "Delete Department") {
            deleteDepartment()
        } else if (response.Selection === "Update Department") {
            updateDepartmentId()
        } else {
            quit()
        }
    })
}

// Employee functions
// `View All Employees`

function viewAllEmployees() {
    db.query(`SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name as department, role.salary, CONCAT(manager.first_name, ' ', manager.last_name) as manager FROM employee LEFT JOIN role ON employee.role_id = role.id LEFT JOIN department ON role.department_id = department.id LEFT JOIN employee manager ON manager.id = employee.manager_id`, (err, data) => {
        if (err) throw err
        console.table(data)
        init()
    })
}

// `Add Employee`
function addEmployee() {
    db.query(`SELECT id, title FROM role`, (err, data) => {
        if (err) throw err
        console.table(data)
        inquirer.prompt([{
            type: "input",
            name: "first_name",
            message: "What is the employee's first name?"
        },
        {
            type: "input",
            name: "last_name",
            message: "What is the employee's last name?"
        },
        {
            type: "input",
            name: "role_id",
            message: "What is the employee's role id?"
        },
        {
            type: "input",
            name: "manager_id",
            message: "Who is the employee's manager id?"
        }]).then(response => {
            db.query(`SELECT * FROM role WHERE id = ${response.role_id}`, (err, data) => {
                if (err) throw err
                if (data.length === 0) {
                    console.log("Please enter a valid role id.")
                    return addEmployee()
                }
            })
            db.query(`SELECT * FROM employee WHERE id = ${response.manager_id}`, (err, data) => {
                if (err) throw err
                if (data.length === 0) {
                    console.log("Please enter a valid manager id.")
                    return addEmployee()
                }
            })
            db.query(`INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ('${response.first_name}', '${response.last_name}', ${response.role_id}, ${response.manager_id})`, (err, data) => {
                if (err) throw err
                console.log("Employee has been added to the database.")
                init()
            })
        })
    })
}

// `Update Employee Role`

// Department functions
// `View All Departments`
function viewAllDepartments() {
    db.query(`SELECT * FROM department`, (err, data) => {
        console.table(data)
        init()
    })
}

// `Add Department`
function addDepartment() {
    inquirer.prompt([{
        type: "input",
        name: "name",
        message: "What is the name of the department?"
    }]).then(response => {
        db.query(`INSERT INTO department (name) VALUES ('${response.name}')`, (err) => {
            if (err) throw err
            console.log(`The department ${response.name} has been added.`)
            init()
        })
    })
}

// `Update Department ID`
function updateDepartmentId() {
    db.query(`SELECT * FROM department`, (err, data) => {
        console.table(data)
        inquirer.prompt([{
            type: "input",
            name: "oldId",
            message: "What is the ID of the department you want to change?"
        },
        {
            type: "input",
            name: "newId",
            message: "What is the new ID for the department you want to change?"
        }]).then(response => {
            db.query(`UPDATE department SET id = ${response.newId} WHERE id = ${response.oldId}`, (err, data) => {
                if (err) throw err
                console.log(`The department id has been changed from ${response.oldId} to ${response.newId}`)
                init()
            })
        })
    })
}

// `Delete Department`
function deleteDepartment() {
    db.query(`SELECT * FROM department`, (err, data) => {
        console.table(data)
        inquirer.prompt([{
            type: "input",
            name: "id",
            message: "What is the id of the department you want to delete?"
        }]).then(response => {
            db.query(`DELETE FROM department WHERE id = ${response.id}`, (err, data) => {
                if (err) throw err
                console.log(`The department with id ${response.id} has been deleted.`)
                init()
            })
        })
    })
}

// Quit application
function quit() {
    db.end(function (err) {
        if (err) throw err;
        console.log('Goodbye!');
        process.exit();
    });
}