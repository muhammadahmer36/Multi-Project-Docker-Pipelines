USE [HBS_EcoMobile]
GO
/****** Object:  StoredProcedure [dbo].[RGST_UserAccount_Ins]    Script Date: 8/31/2023 9:20:21 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
/*-- =============================================
-- Client:		HBS EcoMobile
-- Created:		10/10/2019 RD
-- Description:	creates user account for mobile application
				HBS_wireframes_v2.3.pdf page#8	- Create Account
-- =============================================*/
ALTER PROCEDURE [dbo].[RGST_UserAccount_Ins]
				@in_employeenumber	VARCHAR(10),
				@in_loginname		NVARCHAR(500),
				@in_passwordhash	NVARCHAR(1000),
				@in_passwordsalt	NVARCHAR(500),
				@in_emailaddress	NVARCHAR(500),
				@in_mobilenumber	NVARCHAR(500)
AS	
	DECLARE @v_statuscode	INT = dbo.ValidateEmployeeNumber(@in_employeenumber),
			@v_statusmsg	NVARCHAR(MAX) =''
BEGIN	
	SET NOCOUNT ON;

	--employee number is valid
	IF @v_statuscode = 0
	BEGIN
		--check if user already registered and has an account 
		SET @v_statuscode = dbo.UserAccountExists (@in_employeenumber)

		IF @v_statuscode = 0
		BEGIN
			--validate user login name
			IF EXISTS ( SELECT 'x' FROM UserLogins WHERE UPPER(loginname) = UPPER(@in_loginname) )
				SET @v_statuscode = 3		--login name is used already
		END 
	END 

	--create an user account
	IF @v_statuscode = 0
	BEGIN
		DECLARE @v_id					INT,
				@v_pswexpirationdate	DATETIME
				
		SELECT @v_pswexpirationdate =  DATEADD(MINUTE, ISNULL(PswExpiredMinutesMax, 518400), GETDATE())
		FROM mblappcontrol 

		--1.1. create account record
		INSERT INTO useraccounts 
			(empno, emailaddress, PhoneNumber, lockstatus, modifiedby, modifiedon, attempts)
		VALUES(@in_employeenumber, @in_emailaddress, @in_mobilenumber, 0, @in_employeenumber, GETDATE(), 0)
		
		SET @v_id = @@IDENTITY

		--1.2. create account AUDIT record
		EXEC dbo.UserAccountsAudit_Ins @v_id		

		--2.1. create login/credentials record
		INSERT INTO userlogins 
			(useraccountid, loginname, PasswordHash, PasswordSalt, expirationdate, modifiedby, modifiedon)
		VALUES (@v_id, @in_loginname, @in_passwordhash, @in_passwordsalt, @v_pswexpirationdate, @in_employeenumber, GETDATE())

		SET @v_id = @@IDENTITY
		--2.2.  create login/credentials AUDIT record
		EXEC dbo.UserLoginsAudit_Ins @v_id		

		SET @v_statuscode = 32 --account succussfully created
	END 

	SET @v_statusmsg = IIF (@v_statuscode = 0, '', dbo.getappmessage(@v_statuscode, DEFAULT))
	
	SELECT @v_statuscode AS StatusCode, @v_statusmsg AS StatusMessage

    SET NOCOUNT OFF;
END

