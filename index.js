import inquirer from 'inquirer';
import cTable from 'console.table';
import MySqlInterface from './dbInterface.cjs';

const dbi = new MySqlInterface({
    host: 'localhost',
    user: 'root',
    database: 'employees_db',
    password: process.env.PASSWORD
});

async function main() {
    
    // Base for the menu prompt
    const MENU_PROMPT = [
        {
            type: 'list',
            message: 'What would you like to do?',
            name: 'choice',
            choices: []
        }
    ];

    // Annotated/wrapped fxns with their human-readable names
    const regularFunctions = [
        { prompt: 'View All Employees', fxn: viewEmployees },
        { prompt: 'Add Employee', fxn: addEmployee },
        { prompt: 'Update Employee Role', fxn: updateEmployeeRole },
        { prompt: 'View All Roles', fxn: viewRoles },
        { prompt: 'Add Role', fxn: addRole },
        { prompt: 'View All Departments', fxn: viewDepartments },
        { prompt: 'Add Department', fxn: addDepartment }
    ];
    // The bonus functions
    const bonusFunctions = [
        { prompt: 'Update Employee Manager', fxn: updateEmployeeManager },
        { prompt: 'View Employees By Manager', fxn: viewEmployeesByManager },
        { prompt: 'View Employees By Department', fxn: viewEmployeesByDepartment },
        { prompt: 'Delete Employee', fxn: deleteEmployee },
        { prompt: 'Delete Role', fxn: deleteRole },
        { prompt: 'Delete Department', fxn: deleteDepartment },
        { prompt: 'Get Department Budget', fxn: getDepartmentBudget }
    ];
    // Will hold all of the functions
    const combinedFunctions = [];

    // Create the main menu from the arrays of menu options above

    // Offset is to allow 0 to be the Quit case
    let valueOffset = 1;

    // Add each function to the prompt choices array
    regularFunctions.forEach((e, idx) => {
        MENU_PROMPT[0].choices.push({ name: e.prompt, value: idx + valueOffset});
        combinedFunctions.push(e.fxn);
    });
    valueOffset += regularFunctions.length;

    // Separate the sections with a separator
    MENU_PROMPT[0].choices.push(new inquirer.Separator('-- Special --'));

    bonusFunctions.forEach((e, idx) => {
        MENU_PROMPT[0].choices.push({ name: e.prompt, value: idx + valueOffset});
        combinedFunctions.push(e.fxn);
    });

    MENU_PROMPT[0].choices.push({ name: 'Quit', value: 0})

    let choice = 0;
    do {
        choice = (await inquirer.prompt(MENU_PROMPT)).choice;
        if (choice > 0) {
            await combinedFunctions[choice - 1]();
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

    // Push each role Title and corresponding Id into the question
    const roles = await dbi.getRoles();
    roles.forEach(element => PROMPT[2].choices.push({name: element.Title, value: element.Id}));
    
    // Push each employee name and corresponding Id into the question
    const managers = await dbi.getEmployees();
    managers.forEach(element => {
        const fullName = `${element['First Name']} ${element['Last Name']}`;
        PROMPT[3].choices.push({name: fullName, value: element.Id});
    });
    PROMPT[3].choices.push({name: 'None', value: null});

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
    
    // Push each employee name and corresponding Id into the question
    const employees = await dbi.getEmployees();
    employees.forEach(element => {
        const fullName = `${element['First Name']} ${element['Last Name']}`;
        PROMPT[0].choices.push({name: fullName, value: element.Id});
    });

    // Push each role Title and corresponding Id into the question
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

    // Push each department Name and corresponding Id into the question
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
    
    // Push each employee name and corresponding Id into the question
    // Once for each question
    const employees = await dbi.getEmployees();
    employees.forEach(element => {
        const fullName = `${element['First Name']} ${element['Last Name']}`;
        PROMPT[0].choices.push({name: fullName, value: element.Id});
        PROMPT[1].choices.push({name: fullName, value: element.Id});
    });
    PROMPT[1].choices.push({name: 'None', value: null});

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
    ];
    
    // Push each employee name and corresponding Id into the question
    const employees = await dbi.getManagers();
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
    ];
    
    // Push each department name and corresponding Id into the question
    const departments = await dbi.getDepartments();
    departments.forEach(element => {
        PROMPT[0].choices.push({name: element.Name, value: element.Id});
    });

    const response = await inquirer.prompt(PROMPT);
    console.table(await dbi.getDepartmentEmployees(response.department));
}

async function deleteEmployee() {
    const PROMPT = [
        {
            type: 'list',
            message: 'Choose the employee to delete: ',
            name: 'employee',
            choices: []
        }
    ];
    
    // Push each employee name and corresponding Id into the question
    const employees = await dbi.getEmployees();
    employees.forEach(element => {
        const fullName = `${element['First Name']} ${element['Last Name']}`;
        PROMPT[0].choices.push({name: fullName, value: element.Id});
    });

    const response = await inquirer.prompt(PROMPT);
    await dbi.deleteEmployee(response.employee);
}

async function deleteRole() {
    const PROMPT = [
        {
            type: 'list',
            message: 'Choose the role to delete: ',
            name: 'role',
            choices: []
        }
    ];
    
    // Push each role Title and corresponding Id into the question
    const roles = await dbi.getRoles();
    roles.forEach(element => PROMPT[0].choices.push({name: element.Title, value: element.Id}));

    const response = await inquirer.prompt(PROMPT);
    await dbi.deleteRole(response.role);
}

async function deleteDepartment() {
    const PROMPT = [
        {
            type: 'list',
            message: 'Choose the department to delete: ',
            name: 'department',
            choices: []
        }
    ];
    
    // Push each department name and corresponding Id into the question
    const departments = await dbi.getDepartments();
    departments.forEach(element => PROMPT[0].choices.push({name: element.Name, value: element.Id}));

    const response = await inquirer.prompt(PROMPT);
    await dbi.deleteDepartment(response.department);
}

async function getDepartmentBudget() {
    const PROMPT = [
        {
            type: 'list',
            message: 'Choose which department\'s budget to see: ',
            name: 'department',
            choices: []
        }
    ];
    
    // Push each department name and corresponding Id into the question
    const departments = await dbi.getDepartments();
    departments.forEach(element => PROMPT[0].choices.push({name: element.Name, value: element.Id}));

    const response = await inquirer.prompt(PROMPT);
    console.table(await dbi.getDepartmentBudget(response.department));
}

main();