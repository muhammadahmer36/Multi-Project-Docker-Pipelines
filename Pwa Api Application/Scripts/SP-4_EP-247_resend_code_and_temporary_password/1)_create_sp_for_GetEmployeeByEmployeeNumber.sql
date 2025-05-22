-- ================================================
-- Template generated from Template Explorer using:
-- Create Procedure (New Menu).SQL
--
-- Use the Specify Values for Template Parameters 
-- command (Ctrl-Shift-M) to fill in the parameter 
-- values below.
--
-- This block of comments will not be included in
-- the definition of the procedure.
-- ================================================
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		<Author,,Name>
-- Create date: <Create Date,,>
-- Description:	<Description,,>
-- =============================================
CREATE PROCEDURE GetEmployeeByEmployeeNumber
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

	IF @v_statuscode = @v_send_confirmation_email
	BEGIN
	
		SELECT  
			empno AS EmployeeNumber,
			 EmailAddress AS EmployeeEmail
		FROM UserAccounts 
		WHERE empno = @in_employeenumber   
	END
END
GO
