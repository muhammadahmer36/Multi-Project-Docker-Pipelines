USE [HBS_EcoMobile]
GO
/****** Object:  StoredProcedure [dbo].[RGST_ValidateEmployee]    Script Date: 9/11/2023 3:40:06 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
/*-- =============================================
-- Client:		HBS EcoMobile
-- Created:		10/10/2019 RD
-- Description:	validates employee number during user registration
   Returns:		1. select with code (int:1/0)  and message
				2. mobile app authentication type configuration
				3. password validation parameters
				HBS_wireframes_v2.3.pdf page#5,6,7,8
-- =============================================*/
ALTER PROCEDURE [dbo].[RGST_ValidateEmployee]
					@in_employeenumber	VARCHAR(10)
AS	
	--check if employee is active
	DECLARE @v_statuscode	INT =  dbo.ValidateEmployeeNumber(@in_employeenumber),
			@v_statusmsg	NVARCHAR(MAX) = ''	
BEGIN	
	SET NOCOUNT ON;
	
	--check if account exists but account is not confirmed
	IF  @v_statuscode = 2 AND EXISTS(SELECT '*' FROM UserAccounts U WHERE U.EmpNo = @in_employeenumber AND U.IsEmailConfirmed = 0) SET @v_statuscode = 34

	SET @v_statusmsg = IIF (@v_statuscode = 0, '', dbo.getappmessage(@v_statuscode, DEFAULT))

	SELECT @v_statuscode AS statuscode, @v_statusmsg AS statusmessage

	IF @v_statuscode IN (0, 34)
	BEGIN    
		--bring data to be able to populate "Create a new Account" page 
		DECLARE @v_AuthenticationTypeID	INT  = 0

		SELECT @v_AuthenticationTypeID = ISNULL(AuthenticationTypeID, 0) FROM MBLAppControl	
		 
		SELECT @v_AuthenticationTypeID AS AuthenticationTypeID, 
			empno AS EmployeeNumber,
			employeename AS EmployeeName,
			ISNULL(emailname, '') AS EmployeeEmail
		FROM master 
		WHERE empno = @in_employeenumber    
	
		--3. password validation parameters
		EXEC dbo.PswValidatorParameters_Get
	END    
    
    SET NOCOUNT OFF;
END





