USE [HBS_EcoMobile]
GO
/****** Object:  UserDefinedFunction [dbo].[UserPasswordExpirationDate]    Script Date: 10/17/2023 9:53:51 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
/*-- =============================================
-- Created:		10/16/2023 JK
-- Description:	Function to return the PWExpirationdate based upon the 
--				pwdexpires from the control table
-- =============================================*/
ALTER FUNCTION [dbo].[UserPasswordExpirationDate]
(
    @in_useraccountid INT
)
RETURNS DATE
AS
BEGIN
    DECLARE @v_no_of_days_pwd_expires SMALLINT = ISNULL((SELECT pwdexpires FROM dbo.control), 0);

    RETURN 
	(
		SELECT IIF(@v_no_of_days_pwd_expires = 0, NULL ,DATEADD(dd, @v_no_of_days_pwd_expires, ul.ModifiedOn))
		FROM [dbo].[UserLogins] ul
		WHERE ul.UserAccountID = @in_useraccountid
	);

END;


