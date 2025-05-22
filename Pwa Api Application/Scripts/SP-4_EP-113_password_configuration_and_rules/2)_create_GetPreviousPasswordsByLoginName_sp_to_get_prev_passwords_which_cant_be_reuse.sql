USE [HBS_EcoMobile]
GO
/****** Object:  StoredProcedure [dbo].[GetPreviousPasswordsByLoginName]    Script Date: 10/19/2023 12:10:28 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

CREATE PROCEDURE  [dbo].[GetPreviousPasswordsByLoginName] @in_loginname NVARCHAR(50)
AS
DECLARE @v_no_of_days_before_prev_pass_reuse SMALLINT = 0,
        @v_no_of_unique_pass_before_prev_pass_reuse SMALLINT = 0;
BEGIN
    -- SET NOCOUNT ON added to prevent extra result sets from
    -- interfering with SELECT statements.
    SET NOCOUNT ON;

    SELECT @v_no_of_days_before_prev_pass_reuse = ISNULL(CC.pwnotreuse, 0),
           @v_no_of_unique_pass_before_prev_pass_reuse = ISNULL(CC.pwNoForReuse, 0)
    FROM control CC;

	SELECT * FROM 
	(
		SELECT TOP (@v_no_of_unique_pass_before_prev_pass_reuse)
			   ISNULL(PasswordHash, '') AS passwordhash,
			   ISNULL(PasswordSalt, '') AS passwordsalt,
			   l.ModifiedOn
		FROM dbo.UserLoginsAudit l
		WHERE l.LoginName = @in_loginname
		ORDER BY l.ID DESC
		UNION
		SELECT 
			   ISNULL(PasswordHash, '') AS passwordhash,
			   ISNULL(PasswordSalt, '') AS passwordsalt,
			   l.ModifiedOn
		FROM dbo.UserLoginsAudit l
		WHERE 
		l.LoginName = @in_loginname 
		AND @v_no_of_days_before_prev_pass_reuse > 0
		AND DATEDIFF(DAY, ModifiedOn, GETDATE()) < @v_no_of_days_before_prev_pass_reuse
	) 

	previouspasswords

END;