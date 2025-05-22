INSERT INTO AppMessages ([ID], [Title], [Description], [ModifiedBy], [ModifiedOn]) 
VALUES 
  (42, 'You cannot use a previous password. Please generate a new password.', 'Cannot Set Previous password','Hamza', GETDATE())
, (44, 'Password must contain: {0}', 'Password Validation Fails', 'Hamza', GETDATE())