USE [HBS_EcoMobile]
GO
/****** Object:  StoredProcedure [dbo].[ResetPassword]    Script Date: 10/9/2023 4:36:38 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
/*-- =============================================
-- Created:		10/21/2019 RD
-- Description:	set new password	HBS_wireframes_v2.3.pdf page#13 "Set New Password"
-- =============================================*/
ALTER PROCEDURE [dbo].[ResetPassword]
					@in_useraccountid	INT,			--useraccount.id value
					@in_passwordhash	NVARCHAR(1000),
					@in_passwordsalt	NVARCHAR(500)					
AS
	DECLARE 
			@v_userloginid		INT, 		
			@v_password_updated SMALLINT = 39;
BEGIN	
	SET NOCOUNT ON;
	
	SELECT @v_userloginid = id FROM UserLogins WHERE UserAccountID = @in_useraccountid

	UPDATE UserLogins
		SET PasswordHash = @in_passwordhash,
			PasswordSalt = @in_passwordsalt,
			ModifiedBy = 'Reset password ' + LoginName,
			ModifiedOn = GETDATE()
	WHERE id = @v_userloginid

	UPDATE dbo.UserAccounts SET 
		Attempts = 0,
        ModifiedBy = EMPNO,
        ModifiedOn = GETDATE()
    WHERE ID = @in_useraccountid;

	-- add AUDIT record
	EXEC dbo.UserLoginsAudit_Ins @v_userloginid		    

	
    SELECT @v_password_updated AS statuscode, dbo.GetAppMessage(@v_password_updated, DEFAULT) AS statusmessage;

END

