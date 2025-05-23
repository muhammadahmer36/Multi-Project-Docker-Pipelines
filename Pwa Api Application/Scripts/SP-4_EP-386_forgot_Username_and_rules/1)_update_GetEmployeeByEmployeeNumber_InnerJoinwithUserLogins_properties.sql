USE [HBS_EcoMobile]
GO
/****** Object:  StoredProcedure [dbo].[GetEmployeeByEmployeeNumber]    Script Date: 10/16/2023 4:34:39 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

ALTER PROCEDURE [dbo].[GetEmployeeByEmployeeNumber]
					@in_employeenumber	VARCHAR(10)
AS
	DECLARE @v_statuscode INT =  dbo.IsEmployeeNumberValid(@in_employeenumber),
		@v_account_exists INT = 2,
		@v_account_doest_not_exists INT = 4,
		@v_send_confirmation_email INT = 40;
BEGIN

	SET NOCOUNT ON;
    
	IF @v_statuscode = 0 SET @v_statuscode = dbo.UserAccountExists(@in_employeenumber);

	IF @v_statuscode = @v_account_exists AND EXISTS(SELECT '*' FROM UserAccounts U WHERE U.EmpNo = @in_employeenumber AND U.IsEmailConfirmed = 0) SET @v_statuscode = @v_send_confirmation_email;

	IF @v_statuscode = 0 SET @v_statuscode = @v_account_doest_not_exists;

    SELECT @v_statuscode AS statuscode, dbo.GetAppMessage(@v_statuscode, DEFAULT) AS statusmessage;

	IF @v_statuscode in (@v_send_confirmation_email,@v_account_exists)
	BEGIN
	
		SELECT  
			UA.EmpNo AS EmployeeNumber,
			 UA.EmailAddress AS EmployeeEmail,
			 UL.LoginName

		FROM UserAccounts AS UA
		INNER JOIN UserLogins AS UL
		ON UL.UserAccountID = UA.ID
		WHERE UA.EmpNo = @in_employeenumber   
	END
END
