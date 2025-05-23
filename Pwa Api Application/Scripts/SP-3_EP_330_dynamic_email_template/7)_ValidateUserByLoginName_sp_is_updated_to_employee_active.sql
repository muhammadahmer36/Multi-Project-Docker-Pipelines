USE [HBS_EcoMobile]
GO
/****** Object:  StoredProcedure [dbo].[ValidateUserByLoginName]    Script Date: 9/21/2023 5:29:58 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
ALTER PROCEDURE [dbo].[ValidateUserByLoginName] 
    @in_loginname NVARCHAR(250)
AS
DECLARE	@v_employee_number VARCHAR(20) = ISNULL((SELECT a.EmpNo FROM UserLogins l INNER JOIN UserAccounts a ON LoginName = @in_loginname AND a.ID = l.UserAccountID), 0),
		@v_no_access INT = 11,
		@v_statuscode INT = 0,
		@v_not_active INT = 1,
	    @v_invalid_username INT = 38,
		@v_send_temppass_on_email INT = 36
		;
		
BEGIN
 SET NOCOUNT ON;


	SET @v_statuscode = 
	(CASE
		WHEN @v_employee_number = 0 THEN @v_invalid_username
		WHEN dbo.IsEmployeeNumberValid(@v_employee_number) = 1 THEN @v_not_active
		WHEN NOT EXISTS(SELECT '*' FROM UserMobileResourceProfiles(@v_employee_number, 0)) THEN @v_no_access
		ELSE @v_send_temppass_on_email
	END);

    SELECT @v_statuscode AS statuscode, dbo.GetAppMessage(@v_statuscode, DEFAULT) AS statusmessage;

	IF @v_statuscode = @v_send_temppass_on_email
	BEGIN
		SELECT 
			ID AS AccountId,
			empno AS EmployeeNumber,
			EmailAddress AS EmployeeEmail,
			@in_loginname AS loginName
		FROM UserAccounts
		WHERE empno = @v_employee_number  
	END

END
