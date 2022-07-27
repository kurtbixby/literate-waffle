INSERT INTO department (id, name)
VALUES  (1, 'Engineering'),
        (2, 'Marketing');

INSERT INTO role (id, title, salary, department_id)
VALUES  (1, 'SDE I', 100000, 1),
        (2, 'SDE II', 130000, 1),
        (3, 'Senior SDE', 160000, 1),
        (4, 'Marketing Planner I', 60000, 2),
        (5, 'Marketing Planner II', 75000, 2),
        (6, 'Senior Marketing Planner', 90000, 2);

INSERT INTO employee (id, first_name, last_name, role_id, manager_id)
VALUES  (1, 'Jeff', 'Dogman', 3, NULL),
        (2, 'Homer', 'Simpson', 3, NULL),
        (3, 'Frank', 'Grimes', 1, 2),
        (4, 'Barney', 'Gumble', 2, 1),
        (5, 'Robert', 'Catman', 6, NULL),
        (6, 'Weiss', 'Grimoire', 5, 5),
        (7, 'Noir', 'Grimoire', 4, 6),
        (8, 'Petey', 'Pirahna', 4, 5),
        (9, 'Rubrum', 'Grimoire', NULL, 5);