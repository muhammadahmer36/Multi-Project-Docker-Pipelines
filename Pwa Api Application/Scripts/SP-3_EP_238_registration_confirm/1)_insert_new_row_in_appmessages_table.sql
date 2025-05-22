INSERT INTO AppMessages ([ID], [Title], [Description], [ModifiedBy], [ModifiedOn]) 
VALUES 
 (34, 'Your account is not confirmed. Please enter the code sent on your {0} to confirm your account.', 'Email is not confirmed.','Hamza', GETDATE())
,(35, 'Invalid code.', 'Code is invalid.','Hamza', GETDATE())