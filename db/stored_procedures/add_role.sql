DELIMITER //

CREATE PROCEDURE sp_add_role(name VARCHAR(30), salary INT, department_id INT)
BEGIN
    INSERT INTO role (name, salary, department_id)
    VALUES (name, salary, department_id);
END //

DELIMITER ;