CREATE PROCEDURE sp_get_departments()
BEGIN
    select id, name from department;
END