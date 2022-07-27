import inquirer from 'inquirer';
import cTable from 'console.table';
import MySqlInterface from './dbInterface.cjs';

const dbi = new MySqlInterface({
    host: 'localhost',
    user: 'root',
    database: 'employees_db',
    password: process.env.PASSWORD
});

const MAIN_MENU_PROMPT = [
    {
        type: 'list',
        message: 'What would you like to do?',
        name: 'choice',
        choices: [
            {
                name: 'View All Employees',
                value: 1
            },
            {
                name: 'Add Employee',
                value: 2
            },
            {
                name: 'Update Employee Role',
                value: 3
            },
            {
                name: 'View All Roles',
                value: 4
            },
            {
                name: 'Add Role',
                value: 5
            },
            {
                name: 'View All Departments',
                value: 6
            },
            {
                name: 'Add Department',
                value: 7
            },
            new inquirer.Separator('-- Special --'),
            {
                name: 'Update Employee Manager',
                value: 8
            },
            {
                name: 'View Employees By Manager',
                value: 9
            },
            {
                name: 'View Employees By Department',
                value: 10
            },
            {
                name: 'Quit',
                value: 0
            }
        ]
    }
]

async function main() {
    const functions = [
        viewEmployees,
        addEmployee,
        updateEmployeeRole,
        viewRoles,
        addRole,
        viewDepartments,
        addDepartment,
        updateEmployeeManager,
        viewEmployeesByManager,
        viewEmployeesByDepartment
    ];
    let choice = 0;
    do {
        choice = (await inquirer.prompt(MAIN_MENU_PROMPT)).choice;
        if (choice > 0) {
            await functions[choice - 1]();
        }
    } while (choice != 0);
}

async function viewEmployees() {
    console.table(await dbi.getEmployees());
}

async function addEmployee() {
    const PROMPT = [
        {
            type: 'input',
            message: 'Enter the new employee\'s first name: ',
            name: 'name'
        },
        {
            type: 'input',
            message: 'Enter the new employee\'s surname: ',
            name: 'surname'
        },
        {
            type: 'list',
            message: 'Choose the new employee\'s role: ',
            name: 'role',
            choices: []
        },
        {
            type: 'list',
            message: 'Choose the new employee\'s manager: ',
            name: 'manager',
            choices: []
        }
    ];

    const roles = await dbi.getRoles();
    roles.forEach(element => PROMPT[2].choices.push({name: element.Title, value: element.Id}));
    
    const managers = await dbi.getEmployees();
    managers.forEach(element => {
        const fullName = `${element['First Name']} ${element['Last Name']}`;
        PROMPT[3].choices.push({name: fullName, value: element.Id});
    });

    const response = await inquirer.prompt(PROMPT);
    await dbi.addEmployee(response.name, response.surname, response.role, response.manager);
}

async function updateEmployeeRole() {
    const PROMPT = [
        {
            type: 'list',
            message: 'Choose the employee to update: ',
            name: 'employee',
            choices: []
        },
        {
            type: 'list',
            message: 'Choose the employee\'s new role: ',
            name: 'role',
            choices: []
        }
    ];
    
    const employees = await dbi.getEmployees();
    employees.forEach(element => {
        const fullName = `${element['First Name']} ${element['Last Name']}`;
        PROMPT[0].choices.push({name: fullName, value: element.Id});
    });

    const roles = await dbi.getRoles();
    roles.forEach(element => PROMPT[1].choices.push({name: element.Title, value: element.Id}));

    const response = await inquirer.prompt(PROMPT);
    await dbi.updateEmployeeRole(response.employee, response.role);
}

async function viewRoles() {
    console.table(await dbi.getRoles());
}

async function addRole() {
    const PROMPT = [
        {
            type: 'input',
            message: 'Enter the new role\'s title: ',
            name: 'title'
        },
        {
            type: 'input',
            message: 'Enter the new role\'s salary: ',
            name: 'salary'
        },
        {
            type: 'list',
            message: 'Choose the new role\'s department: ',
            name: 'department',
            choices: []
        }
    ];

    const department = await dbi.getDepartments();
    department.forEach(element => PROMPT[2].choices.push({name: element.Name, value: element.Id}));

    const response = await inquirer.prompt(PROMPT);
    await dbi.addRole(response.title, response.salary, response.department);
}

async function viewDepartments() {
    console.table(await dbi.getDepartments());
}

async function addDepartment() {
    const PROMPT = [{
        type: 'input',
        message: 'Enter the new department\'s name: ',
        name: 'name'
    }];

    const response = await inquirer.prompt(PROMPT);
    await dbi.addDepartment(response.name);
}

async function updateEmployeeManager() {
    const PROMPT = [
        {
            type: 'list',
            message: 'Choose the employee to update: ',
            name: 'employee',
            choices: []
        },
        {
            type: 'list',
            message: 'Choose the employee\'s new manager: ',
            name: 'manager',
            choices: []
        }
    ];
    
    const employees = await dbi.getEmployees();
    employees.forEach(element => {
        const fullName = `${element['First Name']} ${element['Last Name']}`;
        PROMPT[0].choices.push({name: fullName, value: element.Id});
        PROMPT[1].choices.push({name: fullName, value: element.Id});
    });

    const response = await inquirer.prompt(PROMPT);
    await dbi.updateEmployeeManager(response.employee, response.manager);
}

async function viewEmployeesByManager() {
    const PROMPT = [
        {
            type: 'list',
            message: 'Choose the employee whose reports you\'d like to see: ',
            name: 'employee',
            choices: []
        }
    ]
    const employees = await dbi.getEmployees();
    employees.forEach(element => {
        const fullName = `${element['First Name']} ${element['Last Name']}`;
        PROMPT[0].choices.push({name: fullName, value: element.Id});
    });

    const response = await inquirer.prompt(PROMPT);
    console.table(await dbi.getEmployeesReports(response.employee));
}

async function viewEmployeesByDepartment() {
    const PROMPT = [
        {
            type: 'list',
            message: 'Choose the department whose employees you\'d like to see: ',
            name: 'department',
            choices: []
        }
    ]
    const departments = await dbi.getDepartments();
    departments.forEach(element => {
        PROMPT[0].choices.push({name: element.Name, value: element.Id});
    });

    const response = await inquirer.prompt(PROMPT);
    console.table(await dbi.getDepartmentEmployees(response.department));
}

main();