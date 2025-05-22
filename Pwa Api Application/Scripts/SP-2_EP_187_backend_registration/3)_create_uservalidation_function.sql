Create FUNCTION [dbo].[ValidateEmployeeNumber]
(
	@in_employeenumber VARCHAR(10)
)
RETURNS INT 
AS
BEGIN	
	DECLARE @v_statuscode INT =  dbo.IsEmployeeNumberValid(@in_employeenumber);

	--2.
	IF @v_statuscode = 0 --valid
	BEGIN  
		--check if employee has an account already setup
		SET @v_statuscode = dbo.UserAccountExists(@in_employeenumber);	
		
		--check if account axist but doesnt have application rights
		IF @v_statuscode = 2 AND NOT EXISTS(SELECT '*' FROM UserMobileResourceProfiles(@in_employeenumber, 0))
		BEGIN
			SET @v_statuscode = 11;
		END
		
	END
    
	RETURN @v_statuscode;

END



