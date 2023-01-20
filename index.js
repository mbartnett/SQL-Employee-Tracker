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
    console.log(`
################################################
#                                              #          
#        CONNECTED TO EMPLOYEE DATABASE        #
#                                              #
################################################ 
`)
    init()
})

// Application Questions
const questions = [
    {
        type: "list",
        name: "Selection",
        message: "What would you like to do?",
        choices: ["View All Departments", "View All Roles", "View All Employees", "View Employees By Manager", "View Employees By Department", "View Total Utilized Budget By Department", "Add Department", "Add Role", "Add Employee",  "Update Employee Role", "Update Employee Manager", "Delete Department", "Delete Role", "Delete Employee",  "Quit"],
    }
]

// Application initiation
function init() {
    inquirer.prompt(questions).then(response => {
        switch (response.Selection) {
            case "View All Departments":
                viewAllDepartments();
                break;
            case "View All Roles":
                viewAllRoles();
                break;
            case "View All Employees":
                viewAllEmployees();
                break;
            case "View Employees By Manager":
                viewEmployeesByManager();
                break;
            case "View Employees By Department":
                viewEmployeesByDepartment();
                break;
            case "View Total Utilized Budget By Department":
                viewTotalUtilizedBudgetByDepartment();
                break;
            case "Add Department":
                addDepartment();
                break;
            case "Add Role":
                addRole();
                break;
            case "Add Employee":
                addEmployee();
                break;
            case "Update Employee Role":
                updateEmployeeRole();
                break;
            case "Update Employee Manager":
                updateEmployeeManager();
                break;
            case "Delete Department":
                deleteDepartment();
                break;
            case "Delete Role":
                deleteRole();
                break;
            case "Delete Employee":
                deleteEmployee();
                break;
            default:
                quit();
                break;
        }
    });
}

// VIEW FUNCTIONS
// `View All Departments`
function viewAllDepartments() {
    db.query(`SELECT * FROM department`, (err, data) => {
        console.table(data)
        init()
    })
}

// `View All Roles`
function viewAllRoles() {
    db.query(`SELECT role.id, role.title, department.name AS department, role.salary FROM role LEFT JOIN department ON role.department_id = department.id`, (err, data) => {
        if (err) throw err;
        console.table(data);
        init();
    });
}

// `View All Employees`
function viewAllEmployees() {
    db.query(`SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name as department, role.salary, CONCAT(manager.first_name, ' ', manager.last_name) as manager FROM employee LEFT JOIN role ON employee.role_id = role.id LEFT JOIN department ON role.department_id = department.id LEFT JOIN employee manager ON manager.id = employee.manager_id`, (err, data) => {
        if (err) throw err
        console.table(data)
        init()
    })
}

// `View Employees By Manager`
function viewEmployeesByManager() {
    db.query(`SELECT employee.id, employee.first_name, employee.last_name, CONCAT(manager.first_name, ' ', manager.last_name) as manager, employee.manager_id FROM employee LEFT JOIN employee manager ON employee.manager_id = manager.id WHERE employee.manager_id IS NOT NULL`, (err, data) => {
        if (err) throw err;
        console.table(data);
        init();
    });
}

// `View Employees By Department`
function viewEmployeesByDepartment() {
    db.query(`SELECT id, name FROM department`, (err, data) => {
        if (err) throw err
        console.table(data);
        inquirer.prompt([{
            type: "input",
            name: "departmentId",
            message: "Enter the department ID you would like to view employees for."
        }]).then(response => {
            db.query(`SELECT role.id, employee.first_name, employee.last_name, role.title FROM employee LEFT JOIN role ON employee.role_id = role.id LEFT JOIN department ON role.department_id = department.id WHERE department.id = ${response.departmentId}`, (err, data) => {
                if (err) throw err
                console.table(data);
                init();
            })
        })
    })
}

// `View Total Utilized Budget By Department
function viewTotalUtilizedBudgetByDepartment() {
    db.query(`SELECT department.name, SUM(role.salary) as total_budget FROM department LEFT JOIN role ON department.id = role.department_id GROUP BY department.name`, (err, data) => {
        if (err) throw err;
        console.table(data);
        init();
    });
}

// ADD FUNCTIONS
// `Add Department`
function addDepartment() {
    db.query(`SELECT MAX(id) as max_id FROM department`, (err, data) => {
        if (err) throw err;
        const maxId = data[0].max_id;
        inquirer.prompt([{
            type: "input",
            name: "name",
            message: "What is the name of the department?"
        }]).then(response => {
            db.query(`INSERT INTO department (id, name) VALUES (${maxId + 1}, '${response.name}')`, (err) => {
                if (err) throw err;
                console.log(`The ${response.name}department has been added.`);
                init();
            });
        });
    });
}

// `Add Role`
function addRole() {
    db.query(`SELECT id, name FROM department`, (err, data) => {
        if (err) throw err
        console.table(data);
        db.query(`SELECT MAX(id) as max_id FROM role`, (err, data) => {
            if (err) throw err
            const nextId = data[0].max_id + 1;
            inquirer.prompt([
                {
                    type: "input",
                    name: "title",
                    message: "What is the title of the role?"
                },
                {
                    type: "input",
                    name: "salary",
                    message: "What is the salary of the role?"
                },
                {
                    type: "input",
                    name: "department_id",
                    message: "What is the ID of the department for the role?"
                }
            ]).then(response => {
                db.query(`SELECT * FROM department WHERE id = ${response.department_id}`, (err, data) => {
                    if (err) throw err
                    if (data.length === 0) {
                        console.log("This department does not exist.")
                        return addRole()
                    }
                });
                db.query(`INSERT INTO role (id, title, salary, department_id) VALUES (${nextId}, '${response.title}', ${response.salary}, ${response.department_id})`, (err) => {
                    if (err) throw err
                    console.log(`The ${response.title} role has been added with a salary of $${response.salary}.`)
                    init()
                });
            });
        });
    });
}

// `Add Employee`
function addEmployee() {
    db.query(`SELECT id, title FROM role`, (err, data) => {
        if (err) throw err
        console.table(data)
        db.query(`SELECT MAX(id) as max_id FROM employee`, (err, data) => {
            if (err) throw err
            const nextId = data[0].max_id + 1;
            db.query(`SELECT id, concat(first_name,' ',last_name) as name FROM employee`, (err, data) => {
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
                    message: "What is the employee's role ID?"
                },
                {
                    type: "input",
                    name: "manager_id",
                    message: "What is the employee's manager's ID?"
                }]).then(response => {
                    db.query(`SELECT * FROM role WHERE id = ${response.role_id}`, (err, data) => {
                        if (err) throw err
                        if (data.length === 0) {
                            console.log("Please enter a valid role ID.")
                            return addEmployee()
                        }
                    })
                    if (response.manager_id && response.manager_id.length > 0) {
                        db.query(`SELECT * FROM employee WHERE id = ${response.manager_id}`, (err, data) => {
                            if (err) throw err
                            if (data.length === 0) {
                                console.log("Please enter a valid manager's ID.")
                                return addEmployee()
                            }
                        })
                        db.query(`INSERT INTO employee (id, first_name, last_name, role_id, manager_id) VALUES (${nextId},'${response.first_name}', '${response.last_name}', ${response.role_id}, ${response.manager_id})`, (err, data) => {
                            if (err) throw err
                            console.log("The employee has been added to the database.")
                            init()
                        })
                    } else {
                        db.query(`INSERT INTO employee (id, first_name, last_name, role_id) VALUES (${nextId},'${response.first_name}', '${response.last_name}', ${response.role_id})`, (err, data) => {
                            if (err) throw err
                            console.log("The employee has been added to the database.")
                            init()
                        })
                    }
                })
            })
        })
    })
}

// UPDATE FUNCTIONS
// `Update Employee Role`
function updateEmployeeRole() {
    db.query(`SELECT employee.id, CONCAT(employee.first_name, ' ', employee.last_name) as name, role.title as current_role FROM employee LEFT JOIN role ON employee.role_id = role.id`, (err, data) => {
        if (err) throw err
        console.table(data)
        inquirer.prompt([{
            type: "input",
            name: "employee_id",
            message: "Enter the ID of the employee you want to update."
        },
        {
            type: "input",
            name: "new_role_id",
            message: "What is the employee's new role ID?"
        },
        {
            type: "input",
            name: "new_manager_id",
            message: "What is the employee's new manager's ID?"
        }]).then(response => {
            db.query(`SELECT * FROM role WHERE id = ${response.newRoleId}`, (err, data) => {
                if (err) throw err
                if (data.length === 0) {
                    console.log("Please enter a valid role ID.")
                    return updateEmployeeRole()
                }
            })
            db.query(`UPDATE employee SET role_id = ${response.newRoleId}, manager_id = ${response.newManagerId} WHERE id = ${response.employeeId}`, (err, data) => {
                if (err) throw err
                console.log("Employee's role and manager have been updated.")
                init()
            })
        })
    })
}

// `Update Employee Manager`
function updateEmployeeManager() {
    db.query(`SELECT employee.id, CONCAT(employee.first_name, ' ', employee.last_name) as name, role.title, manager.id as current_manager_id FROM employee LEFT JOIN employee manager ON manager.id = employee.manager_id JOIN role ON employee.role_id = role.id`, (err, data) => {
        if (err) throw err
        console.table(data)
        inquirer.prompt([{
            type: "input",
            name: "employee_id",
            message: "Enter the ID of employee you want to update."
        },
        {
            type: "input",
            name: "new_manager_id",
            message: "What is the new manager id?"
        }]).then(response => {
            db.query(`SELECT * FROM employee WHERE id = ${response.newManagerId}`, (err, data) => {
                if (err) throw err
                if (data.length === 0) {
                    console.log("Please enter a valid manager id.")
                    return updateEmployeeManager()
                }
            })
            db.query(`UPDATE employee SET manager_id = ${response.newManagerId} WHERE id = ${response.employeeId}`, (err, data) => {
                if (err) throw err
                console.log("Employee's manager has been updated.")
                init()
            })
        })
    })
}

// DELETE FUNCTIONS
// `Delete Department`
function deleteDepartment() {
    db.query(`SELECT * FROM department`, (err, data) => {
        console.table(data)
        inquirer.prompt([{
            type: "input",
            name: "id",
            message: "What is the ID of the department you want to delete?"
        }]).then(response => {
            db.query(`DELETE FROM department WHERE id = ${response.id}`, (err, data) => {
                if (err) throw err
                console.log(`The department with id ${response.id} has been deleted.`)
                init()
            })
        })
    })
}

// `Delete Role`
function deleteRole() {
    db.query(`SELECT id, title FROM role`, (err, data) => {
        if (err) throw err
        console.table(data)
        inquirer.prompt([{
            type: "input",
            name: "roleId",
            message: "Enter the ID of the role you would like to delete."
        }]).then(response => {
               db.query(`SELECT * FROM role WHERE id = ${response.roleId}`, (err, data) => {
                if (err) throw err
                if (data.length === 0) {
                    console.log("Please enter a valid role ID.")
                    return deleteRole()
                }
                const roleTitle = data[0].title;
                db.query(`DELETE FROM role WHERE id = ${data[0].id}`, (err, data) => {
                    if (err) throw err
                    console.log(`The role "${roleTitle}" has been deleted.`)
                    init()
                })
            })
        })
    })
}

// `Delete Employee`
function deleteEmployee() {
    db.query(`SELECT * FROM employee`, (err, data) => {
        console.table(data)
        inquirer.prompt({
            type: "input",
            name: "id",
            message: "Enter the ID of the employee to delete."
        }).then(response => {
            db.query(`SET @count = 0;`, (err) => {
                if (err) throw err
                db.query(`UPDATE employee SET id = @count:= @count + 1;`, (err) => {
                    if (err) throw err
                    db.query(`DELETE FROM employee WHERE id = ${response.id}`, (err) => {
                        if (err) throw err
                        console.log("The employee has been deleted.")
                        init()
                    })
                })
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