SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		<Author,,Name>
-- Create date: <Create Date,,>
-- Description:	<Description,,>
-- =============================================
CREATE PROCEDURE [dbo].[UpdatePassword]
					@in_loginname		NVARCHAR(50),
					@in_updatePasswordToken	NVARCHAR(200),
					@in_passwordhash	NVARCHAR(1000),
					@in_passwordsalt	NVARCHAR(500)					
AS
	DECLARE @v_pswexpirationdate DATETIME,
		@v_userloginid INT, 			
		@v_no_access INT = 11,
		@v_statuscode INT = 0,
		@v_pass_updated INT = 39,
		@v_account_exists INT = 2,
	    @v_invalid_username INT = 38,
	    @v_invalid_temp_pass INT = 37,
		@v_employee_number VARCHAR(20) = ISNULL((SELECT a.EmpNo FROM UserLogins l INNER JOIN UserAccounts a ON LoginName = @in_loginname AND a.ID = l.UserAccountID), 0);

BEGIN	
	SET NOCOUNT ON;
	
	SET @v_statuscode = 
	(CASE
		WHEN @v_employee_number = 0 THEN @v_invalid_username
		WHEN NOT EXISTS(SELECT '*' FROM UserMobileResourceProfiles(@v_employee_number, 0)) THEN @v_no_access
		WHEN NOT EXISTS(SELECT '*' FROM UserLogins WHERE loginname = @in_loginname AND refreshtoken = @in_updatePasswordToken) THEN @v_invalid_temp_pass
		ELSE @v_account_exists
	END);

	IF @v_statuscode = @v_account_exists
	BEGIN
	 
		SELECT @v_userloginid = id FROM UserLogins WHERE LoginName = @in_loginname

		--mblappcontrol.PswExpiredMinutesMax value is used to set expiration on the regular password
		SELECT @v_pswexpirationdate =  DATEADD(MINUTE, ISNULL(PswExpiredMinutesMax, 518400), GETDATE())
		FROM mblappcontrol 

		UPDATE UserLogins
			SET PasswordHash = @in_passwordhash,
				PasswordSalt = @in_passwordsalt,
				ExpirationDate = @v_pswexpirationdate,
				ModifiedBy = 'Reset password ' + LoginName,
				ModifiedOn = GETDATE()
		WHERE id = @v_userloginid

		-- add AUDIT record
		EXEC dbo.UserLoginsAudit_Ins @v_userloginid		    

	    SET @v_statuscode = @v_pass_updated;
	END

    SELECT @v_statuscode AS statuscode, dbo.GetAppMessage(@v_statuscode, DEFAULT) AS statusmessage;

END

