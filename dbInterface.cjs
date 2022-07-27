const mysql = require('mysql2/promise');

class MySqlInterface {
    constructor({host = 'localhost', user = 'root', database, password} = {}) {
        this.host = host;
        this.user = user;
        this.database = database;
        this.password = password;
    }

    async getDepartments() {
        return await this.callStoredProcedure('CALL sp_get_departments()');
    }

    async getEmployees() {
        return await this.callStoredProcedure('CALL sp_get_employees()');
    }

    async getRoles() {
        return await this.callStoredProcedure('CALL sp_get_roles()');
    }

    async callStoredProcedure(sql, params = []) {
        const connection = await mysql.createConnection({host: this.host, user: this.user, database: this.database, password: this.password});
        const [rows, fields] = await connection.query(sql, ...params);
        await connection.end();
        return rows[0];
    }
}

module.exports = MySqlInterface;