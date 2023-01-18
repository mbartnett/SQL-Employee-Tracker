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
        choices: ["View All Employees", "Add Employee", "Update Employee Role", "View All Roles", "Add Role", "View All Departments", "Add Department", "Update Department", "Delete Department", "Quit"],
    }
]

// "What is the name of the department?"
// "What is the name of the role?"
// "What is the employee's first name?"
// "What is the employee's last name?"
// "What is the employee's role?"
// "Who is the employee's manager?"
// "Which employee's role do you want to update?"

function init() {
    inquirer.prompt(questions).then(response => {
        if (response.Selection === "View All Departments") {
            viewAllDepartments()
        } else if (response.Selection === "Add Department") {
            addDepartment()
        } else if (response.Selection === "Delete Department") {
            deleteDepartment()
        } else if (response.Selection === "Update Department") {
            updateDepartmentId()
        }
        else {
            quit()
        }
    })
}

//View All Departments
function viewAllDepartments() {
    db.query(`SELECT * FROM department`, (err, data) => {
        console.table(data)
        init()
    })
}

// Add Department
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

// Update Department ID
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

// Delete Department
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

// Quit Application
function quit() {
    db.end(function(err) {
        if (err) throw err;
        console.log('Goodbye!');
        process.exit();
    });
}


// // Add Role
// function addRole() {
//     inquirer.prompt([
//         {
//             type: "input",
//             name: "title",
//             message: "What is the name of the role?"
//         },
//         {
//             type: "input",
//             name: "salary",
//             message: "What is the salary of the role?"
//         },
//         {
//             type: "input",
//             name: "department_id",
//             message: "What is the department id of the role?"
//         }
//     ]).then(response => {
//         db.query(`INSERT INTO role (title, salary, department_id) VALUES ('${response.title}', ${response.salary}, ${response.department_id})`, (err) => {
//             if (err) throw err
//             console.log(`The role ${response.title} has been added.`)
//             init()
//         })
//     })
// }

// // Add Employee
// function addEmployee() {
//     inquirer.prompt([
//         {
//             type: "input",
//             name: "first_name",
//             message: "What is the employee's first name?"
//         },
//         {
//             type: "input",
//             name: "last_name",
//             message: "What is the employee's last name?"
//         },
//         {
//             type: "input",
//             name: "role_id",
//             message: "What is the employee's role id?"
//         },
//         {
//             type: "input",
//             name: "manager_id",
//             message: "Who is the employee's manager id?"
//         }
//     ]).then(response => {
//         db.query(`INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ('${response.first_name}', '${response.last_name}', ${response.role_id}, ${response.manager_id})`, (err) => {
//             if (err) throw err
//             console.log(`The employee ${response.first_name} ${response.last_name} has been added.`)
//             init()
//         })
//     })
// }

// // Update Employee Role
// function updateEmployeeRole() {
//     inquirer.prompt([
//         {
//             type: "input",
//             name: "employee_id",
//             message: "Which employee's role do you want to update?"
//         },
//         {
//             type: "input",
//             name: "role_id",
//             message: "What is the new role id?"
//         }
//     ]).then(response => {
//         db.query(`UPDATE employee SET role_id

// function deleteRole() {
//     inquirer.prompt([{
//         type: "input",
//         name: "id",
//         message: "What is the id of the role you want to delete?"
//     }]).then(response => {
//         db.query(`DELETE FROM role WHERE id = ${response.id}`, (err, data) => {
//             if (err) throw err
//             console.log(`The role with id ${response.id} has been deleted.`)
//             init()
//         })
//     })
// }

// function deleteEmployee() {
//     inquirer.prompt([{
//         type: "input",
//         name: "id",
//         message: "What is the id of the employee you want to delete?"
//     }]).then(response => {
//         db.query(`DELETE FROM employee WHERE id = ${response.id}`, (err, data) => {
//             if (err) throw err
//             console.log(`The employee with id ${response.id} has been deleted.`)
//             init()
//         })
//     })
// }
