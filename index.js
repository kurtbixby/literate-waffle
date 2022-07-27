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
            {
                name: 'Quit',
                value: 0
            }
        ]
    }
]

async function main() {
    let choice = 0;
    do {
        choice = (await inquirer.prompt(MAIN_MENU_PROMPT)).choice;
        switch (choice) {
            case 1:
                await viewEmployees();
                break;
            case 2:
                await addEmployee();
                break;
            case 3:
                await updateEmployeeRole();
                break;
            case 4:
                await viewRoles();
                break;
            case 5:
                await addRole();
                break;
            case 6:
                await viewDepartments();
                break;
            case 7:
                await addDepartment();
                break;
            default:       
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

main();