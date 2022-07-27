DROP PROCEDURE IF EXISTS sp_get_department_budget;

DELIMITER //

CREATE PROCEDURE sp_get_department_budget(department_id INT)
BEGIN
    SELECT d.id AS 'Id', d.name as 'Name', SUM(salary) AS 'Total Budget'
    FROM employee AS e
        INNER JOIN
        role AS r
        ON e.role_id = r.id
        INNER JOIN
        department as d
        ON r.department_id = d.id
        WHERE d.id = department_id;
END //

DELIMITER ;