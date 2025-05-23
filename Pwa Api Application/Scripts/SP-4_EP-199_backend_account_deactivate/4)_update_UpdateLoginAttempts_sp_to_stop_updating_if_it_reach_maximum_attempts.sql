USE [HBS_EcoMobile]
GO
/****** Object:  StoredProcedure [dbo].[UpdateLoginAttempts]    Script Date: 10/18/2023 11:57:18 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

/*-- =============================================
-- Client:		HBS Mobile
-- Created:		03/05/2020 GN
-- Description:	Increments # of login attempts when
--				user logs in with an invalid password
-- =============================================*/
ALTER PROCEDURE  [dbo].[UpdateLoginAttempts]
    @in_loginname NVARCHAR(250),
    @in_devicename NVARCHAR(500) = '',
    @in_deviceid NVARCHAR(500) = '',
    @in_validpassword BIT
AS
DECLARE @v_userloginid INT = 0,
        @v_useraccountid INT = 0,
        @v_empno VARCHAR(10),
        @v_attemptscnt INT,
        @v_maxattempts INT,
        @v_statuscode INT;

DECLARE @c_invalidpassword INT = 31;
DECLARE @c_toomanyattempts INT = 6;

BEGIN
    SET NOCOUNT ON;

    --get user account info
    IF EXISTS
    (
        SELECT 'x'
        FROM MBLAppControl
        WHERE ISNULL(AuthenticationTypeID, 0) = 0
    )
    BEGIN
        --application base authentication
        SELECT @v_userloginid = l.ID,
               @v_useraccountid = a.ID,
               @v_attemptscnt = ISNULL(a.Attempts, 0),
               @v_empno = a.EmpNo
        FROM UserLogins l
            INNER JOIN UserAccounts a
                ON a.ID = l.UserAccountID
        WHERE LoginName = @in_loginname;
    END;
    ELSE
    BEGIN
        --3d party based aythentication, like AD. loginname is an employeenumber which is send from IdP
        SELECT @v_useraccountid = ID,
               @v_attemptscnt = ISNULL(Attempts, 0),
               @v_empno = EmpNo
        FROM UserAccounts
        WHERE EmpNo = @in_loginname;
    END;

    IF @in_validpassword = 1
    BEGIN
        SET @v_statuscode = 0;

        --update number of attempts		
        UPDATE dbo.UserAccounts
        SET Attempts = 0,
            ModifiedBy = @v_empno,
            ModifiedOn = GETDATE()
        WHERE ID = @v_useraccountid;

        --update audit table
        EXEC dbo.UserAccountsAudit_Ins @v_useraccountid;

        --create user account event record:
        EXEC dbo.UserAccountEvents_Sav @v_useraccountid,
                                       @in_deviceid,
                                       @in_devicename,
                                       @v_statuscode;
    END;
    ELSE
    BEGIN
        --get system allowed max attempts to login
        SELECT @v_maxattempts = maxtries
        FROM dbo.control;

        --update number of attempts		
        UPDATE dbo.UserAccounts
        --SET Attempts = @v_attemptscnt + 1,
        SET Attempts = IIF(@v_maxattempts = Attempts, Attempts, @v_attemptscnt + 1),
            ModifiedBy = @v_empno,
            ModifiedOn = GETDATE()
        WHERE ID = @v_useraccountid;

        --check attempts count
        SET @v_statuscode = IIF(@v_attemptscnt >= @v_maxattempts, @c_toomanyattempts, @c_invalidpassword);

        --update audit table
        EXEC dbo.UserAccountsAudit_Ins @v_useraccountid;

        --create user account event record:
        EXEC dbo.UserAccountEvents_Sav @v_useraccountid,
                                       @in_deviceid,
                                       @in_devicename,
                                       @v_statuscode;
    END;

    --return data
    SELECT @v_statuscode AS statuscode,
           dbo.GetAppMessage(@v_statuscode, DEFAULT) AS statusmessage;

    SET NOCOUNT OFF;
END;
