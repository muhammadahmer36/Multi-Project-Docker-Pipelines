USE [HBS_EcoMobile]
GO
/****** Object:  StoredProcedure [dbo].[RGST_UserAccount_Ins]    Script Date: 10/9/2023 5:51:06 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
ALTER PROCEDURE [dbo].[RGST_UserAccount_Ins]
				@in_employeenumber	VARCHAR(10),
				@in_loginname		NVARCHAR(500),
				@in_passwordhash	NVARCHAR(1000),
				@in_passwordsalt	NVARCHAR(500),
				@in_emailaddress	NVARCHAR(500),
				@in_mobilenumber	NVARCHAR(500),
				@in_isemailconfirmed BIT
AS	
	DECLARE @v_statuscode	INT = dbo.IsEmployeeNumberValid(@in_employeenumber),
			@v_statusmsg	NVARCHAR(MAX) = '',
			@v_login_name_already_used INT = 3,
			@v_email_not_belong_to_emp INT = 33,
			@v_send_confirmation_email INT = 40,
			@v_account_is_not_confirmed INT = 34;

BEGIN	
	SET NOCOUNT ON;

	--check if employee enter his valid email
	IF @v_statuscode = 0 AND NOT EXISTS(SELECT '*' FROM Master M WHERE M.EMPNO = @in_employeenumber AND M.EMAILNAME = @in_emailaddress) SET @v_statuscode = @v_email_not_belong_to_emp

	--employee number is valid
	IF @v_statuscode = 0
	BEGIN
		--check if user already registered and has an account 
		SET @v_statuscode = dbo.UserAccountExists (@in_employeenumber)
	
		--validate user login name
		IF @v_statuscode = 0 AND EXISTS(SELECT 'x' FROM UserLogins WHERE loginname = @in_loginname) SET @v_statuscode = @v_login_name_already_used;		--login name is used already
		
	END 
	
	--check if account is confirmed enter his valid email
	IF @v_statuscode = 2 AND EXISTS(SELECT '*' FROM UserAccounts U WHERE U.EmpNo = @in_employeenumber AND U.IsEmailConfirmed = 0) SET @v_statuscode = @v_account_is_not_confirmed

	IF @v_statuscode = @v_account_is_not_confirmed AND EXISTS(SELECT '*' FROM UserAccounts U WHERE U.EmpNo = @in_employeenumber AND U.RegistrationCode = '') SET @v_statuscode = @v_send_confirmation_email

	--create an user account
	IF @v_statuscode = 0
	BEGIN
		DECLARE @v_id INT;

		--1.1. create account record
		INSERT INTO useraccounts 
			(empno, emailaddress, PhoneNumber, lockstatus, modifiedby, modifiedon, attempts, isemailconfirmed, registrationcode)
		VALUES(@in_employeenumber, @in_emailaddress, @in_mobilenumber, 0, @in_employeenumber, GETDATE(), 0, @in_isemailconfirmed, '')
		
		SET @v_id = SCOPE_IDENTITY();

		--1.2. create account AUDIT record
		EXEC dbo.UserAccountsAudit_Ins @v_id		

		--2.1. create login/credentials record
		INSERT INTO userlogins 
			(useraccountid, loginname, PasswordHash, PasswordSalt, modifiedby, modifiedon)
		VALUES (@v_id, @in_loginname, @in_passwordhash, @in_passwordsalt, @in_employeenumber, GETDATE())

		SET @v_id = SCOPE_IDENTITY();
		--2.2.  create login/credentials AUDIT record
		EXEC dbo.UserLoginsAudit_Ins @v_id		

		SET @v_statuscode = @v_send_confirmation_email;
	END 

	SET @v_statusmsg = IIF (@v_statuscode = 0, '', dbo.getappmessage(@v_statuscode, DEFAULT))
	
	SELECT @v_statuscode AS StatusCode, @v_statusmsg AS StatusMessage

    SET NOCOUNT OFF;
END