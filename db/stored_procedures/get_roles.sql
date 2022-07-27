DELIMITER //

CREATE PROCEDURE sp_get_roles()
BEGIN
    select r.id, r.title, r.salary, d.name from role r INNER JOIN department d on r.department_id = d.id;
END //

DELIMITER ;