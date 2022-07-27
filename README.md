# Literate Waffle - Employee Database Frontend

![License](https://img.shields.io/badge/License-MIT-blue.svg)

## Description

A command line frontend for managing an employees MySQL database. A video demonstration of this application can be found on [YouTube]().

Functionality includes:
* Adding a department, employee, or role
* Deleting a department, employee, or role
* Listing all departments, employees, or roles
* Listing a department's employees
* Displaying a department's budget
* Displaying an employee's direct reports
* Changing an employee's manager
* Changing an employee's role

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [Contributing](#contributing)
- [Tests](#tests)
- [Questions](#questions)
- [License](#license)

## Installation

This application requires Node.js and npm to run. To run this application, download the code to your computer via a git clone or a zip download. Navigate to that directory and run ```npm install``` to install all dependencies, then execute ```npm run start``` or ```node index.js``` to run the application.

## Usage

This application can be used to create, manage, and interface with an employee database.

## Contributing

Although this application is no longer under active development, I welcome any and all pull requests from those who would like to contribute to and improve this software.

## Tests

This software currently does not have any tests.

## Questions

* What packages does this project use?
  * [Inquirer](https://www.npmjs.com/package/inquirer) for user input
  * [MySQL2](https://www.npmjs.com/package/mysql2) for handling the database connection
  * [console.table](https://www.npmjs.com/package/console.table) for printing the data to the console

## License

MIT License

Copyright (c) 2022 kurtbixby

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
