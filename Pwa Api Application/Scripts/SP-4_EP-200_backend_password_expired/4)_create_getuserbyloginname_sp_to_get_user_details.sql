USE [HBS_EcoMobile]
GO
/****** Object:  StoredProcedure [dbo].[GetUserByLoginName]    Script Date: 10/10/2023 2:51:24 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE PROCEDURE [dbo].[GetUserByLoginName] 
    @in_loginname NVARCHAR(250)
AS
DECLARE	
		@v_no_access INT = 11,
		@v_statuscode INT = 0,
		@v_not_active INT = 1,
        @v_userloginid INT = 0,
        @v_useraccountid INT = 0,
        @v_empno VARCHAR(10),
		@v_isEmailConfirmed BIT = 0,
        @v_pswexpirationdate DATETIME = NULL,
		@v_invalid_credentials SMALLINT = 31,
		@v_password_expired INT = 5,
		@v_password_doesnt_expired INT = 41,
		@v_account_is_not_confirmed INT = 34
		;
		
BEGIN
 SET NOCOUNT ON;

		SELECT	 
			   @v_pswexpirationdate = [dbo].[UserPasswordExpirationDate](a.ID),
               @v_userloginid = ISNULL(l.ID, 0),
               @v_useraccountid = ISNULL(a.ID, 0),
			   @v_isEmailConfirmed = a.IsEmailConfirmed,
               @v_empno = a.EmpNo
        FROM UserLogins l INNER JOIN UserAccounts a ON a.ID = l.UserAccountID
        WHERE LoginName = @in_loginname;


	SET @v_statuscode = 
	(CASE
		WHEN @v_useraccountid = 0 THEN @v_invalid_credentials
		WHEN dbo.IsEmployeeNumberValid(@v_empno) = @v_not_active THEN @v_not_active
		WHEN NOT EXISTS(SELECT '*' FROM UserMobileResourceProfiles(@v_empno, 0)) THEN @v_no_access
		WHEN DATEDIFF(MINUTE, GETDATE(), @v_pswexpirationdate) > 0 THEN @v_password_doesnt_expired
		WHEN @v_isEmailConfirmed = 0 THEN @v_account_is_not_confirmed
		ELSE @v_password_expired
	END);

    SELECT @v_statuscode AS statuscode, dbo.GetAppMessage(@v_statuscode, DEFAULT) AS statusmessage;

	IF @v_statuscode IN (@v_password_expired, @v_account_is_not_confirmed)
	BEGIN
		
        SELECT 
			a.ID AS useraccountid, --return user account id as user identifier, because UserLogins table may not be used with 3d party authentication provider
            ISNULL(PasswordHash, '') AS passwordhash,
            ISNULL(PasswordSalt, '') AS passwordsalt
        FROM UserAccounts a 
		LEFT JOIN dbo.UserLogins l ON l.UserAccountID = a.ID
        WHERE a.ID = @v_useraccountid;

		EXEC @v_statuscode = dbo.Dashboard_Get @v_useraccountid;
            
		SELECT 
			0 AS AuthenticationTypeID, 
			empno AS EmployeeNumber,
			EmailAddress AS EmployeeEmail
		FROM UserAccounts 
		WHERE ID = @v_useraccountid
		
	END

END


 