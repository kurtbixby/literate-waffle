const mysql = require('mysql2/promise');

class MySqlInterface {
    constructor({host = 'localhost', user = 'root', database, password} = {}) {
        this.host = host;
        this.user = user;
        this.database = database;
        this.password = password;
    }

    async getDepartments() {
        const results = await this.callStoredProcedure('CALL sp_get_departments()');
        return results[0];
    }

    async getEmployees() {
        const results = await this.callStoredProcedure('CALL sp_get_employees()');
        return results[0];
    }

    async getRoles() {
        const results = await this.callStoredProcedure('CALL sp_get_roles()');
        return results[0];
    }
    
    async addDepartment(name) {
        await this.callStoredProcedure('CALL sp_add_department(?)', [name]);
    }
    
    async addEmployee(firstName, lastName, roleId, managerId) {
        await this.callStoredProcedure('CALL sp_add_employee(?, ?, ?, ?)', [firstName, lastName, roleId, managerId]);
    }
    
    async addRole(title, salary, departmentId) {
        await this.callStoredProcedure('CALL sp_add_role(?, ?, ?)', [title, salary, departmentId]);
    }

    async updateEmployeeRole(employeeId, roleId) {
        await this.callStoredProcedure('CALL sp_update_employee_role(?, ?)', [employeeId, roleId]);
    }

    async callStoredProcedure(sql, params = []) {
        const connection = await mysql.createConnection({host: this.host, user: this.user, database: this.database, password: this.password});
        console.log(params);
        const [rows, fields] = await connection.query(sql, params);
        await connection.end();
        console.log(rows);
        return rows;
    }
}

module.exports = MySqlInterface;