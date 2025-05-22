CREATE PROCEDURE RGST_Confirmation 
@in_code NVARCHAR(50),
@in_employeenumber NVARCHAR(50)
AS
DECLARE @v_statuscode INT = dbo.ValidateEmployeeNumber(@in_employeenumber),
		@v_account_does_not_exist INT = 4,
		@v_account_exist INT = 2,
		@v_invalid_code INT = 35,
		@v_email_not_confirmed INT = 34,
		@v_account_created INT = 32;

BEGIN
  
  SET NOCOUNT ON;
   -- here status code 0 means all the validation passed from ValidateEmployeeNumber scalar function
   -- it means use can create account but this Sp is not for creating account so here wo have to
   -- show account doest exists
   IF @v_statuscode = 0 SET @v_statuscode = @v_account_does_not_exist;

   IF @v_statuscode = @v_account_exist AND EXISTS(SELECT '*' FROM UserAccounts U WHERE U.EmpNo = @in_employeenumber AND U.IsEmailConfirmed = 0)
   BEGIN
    
	 SET @v_statuscode = 
	 (CASE 
	   --'COLLATE Latin1_General_CS_AS' will compare in case sensitive
	   WHEN EXISTS(SELECT '*' FROM UserAccounts U WHERE U.EMPNO = @in_employeenumber AND RegistrationCode COLLATE Latin1_General_CS_AS = @in_code) THEN @v_email_not_confirmed
	   ELSE @v_invalid_code 
	 END);

   END

   IF @v_statuscode = @v_email_not_confirmed
   BEGIN
     UPDATE useraccounts SET IsEmailConfirmed = 1 WHERE EmpNo = @in_employeenumber;
	 
	 SET @v_statuscode = @v_account_created;
   END

   SELECT @v_statuscode AS statuscode, dbo.GetAppMessage(@v_statuscode, DEFAULT) AS statusmessage;
   
END
GO