USE [HBS_EcoMobile]
GO
/****** Object:  StoredProcedure [dbo].[UserAuth]    Script Date: 8/28/2023 7:55:49 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
/*-- =============================================
-- Client:		HBS Mobile
-- Created:		10/14/2019 RD
-- Description:	user authentication with regular and temporary passwords		HBS_wireframes_v2.3.pdf page#1, 11 - "submit"				
-- =============================================*/
ALTER PROCEDURE [dbo].[UserAuth]
    @in_loginname NVARCHAR(250),
    @in_devicename NVARCHAR(500) = '',
    @in_deviceid NVARCHAR(500) = ''
AS
DECLARE @v_statuscode INT = 0,
        @v_statusmsg NVARCHAR(MAX) = '',
        @v_pswexpirationdate DATETIME = NULL,
        @v_userloginid INT = 0,
        @v_useraccountid INT = 0,
        @v_empno VARCHAR(10),
        @v_attemptscnt INT,
        @v_afterpswrecovering BIT = 0;
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
        SELECT @v_pswexpirationdate = ExpirationDate,
               @v_userloginid = l.ID,
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

    IF ISNULL(@v_useraccountid, 0) = 0
    BEGIN
        SET @v_statuscode = 31; --Invalid Credentials or the account does not exist., select * from AppMessages where id = 31
    END;
    ELSE
    BEGIN
        IF ISDATE(@v_pswexpirationdate) = 1
           AND ISNULL(@v_userloginid, 0) > 0
        BEGIN
            --check password expiration for application based authentication only
            IF DATEDIFF(MINUTE, GETDATE(), @v_pswexpirationdate) <= 0
            BEGIN
                SET @v_statuscode = 5; --select * from AppMessages where id = 5
            END;

            IF @v_statuscode = 0
            BEGIN
                DECLARE @v_maxattempts INT;
                --get system allowed max attempts to login
                SELECT @v_maxattempts = maxtries
                FROM dbo.control;
                --2. check attempts count
                --SET @v_statuscode = IIF ( @v_attemptscnt >= @v_maxattempts, 6, 0)		--select * from AppMessages where id = 6
                IF @v_attemptscnt >= @v_maxattempts
                BEGIN
                    SET @v_statuscode = 6;
                END;
            END;
        END;

        IF @v_statuscode = 0
        BEGIN
            --3. check employee status for any authentication type
            SET @v_statuscode = dbo.IsEmployeeNumberValid(@v_empno);
        END;
        ELSE
        BEGIN
            --4. update number of attempts
            UPDATE dbo.UserAccounts
            SET Attempts = ISNULL(Attempts, 0) + 1,
                ModifiedBy = @v_empno,
                ModifiedOn = GETDATE()
            WHERE ID = @v_useraccountid;

            --4.1update audit table
            EXEC dbo.UserAccountsAudit_Ins @v_useraccountid;

            --4.2. update account events records
            EXEC dbo.UserAccountEvents_Sav @v_useraccountid,
                                           @in_deviceid,
                                           @in_devicename,
                                           @v_statuscode;
        END;

        --4. update number of attempts		
        --UPDATE dbo.UserAccounts 
        --	SET attempts = IIF( @v_statuscode = 0, 0, ISNULL(attempts, 0) + 1 ),
        --		ModifiedBy = @v_empno,
        --		Modifiedon = GETDATE() 
        --WHERE id = @v_useraccountid

        --update audit table
        --EXEC dbo.UserAccountsAudit_Ins @v_useraccountid

        --4. create user account event record:
        --4.1. check first, if prev. action was password recovering
        DECLARE @v_statuscode_pswrecovering INT = 7; --dbo.AppMessages

        IF EXISTS
        (
            SELECT 'x'
            FROM dbo.UserAccountEvents
            WHERE UserAccountID = @v_useraccountid
                  AND EventStatus = @v_statuscode_pswrecovering
        )
        BEGIN
            SET @v_afterpswrecovering = 1;
        END;
    ----4.2. update account events records
    --EXEC dbo.UserAccountEvents_Sav @v_useraccountid, @in_deviceid, @in_devicename, @v_statuscode		
    END;

    ----return data
    SELECT @v_statuscode AS statuscode,
           dbo.GetAppMessage(@v_statuscode, DEFAULT) AS statusmessage;

    IF @v_statuscode = 0
    BEGIN
        SELECT a.ID AS useraccountid, --return user account id as user identifier, because UserLogins table may not be used with 3d party authentication provider
               ISNULL(PasswordHash, '') AS passwordhash,
               ISNULL(PasswordSalt, '') AS passwordsalt
        FROM UserAccounts a
            LEFT JOIN dbo.UserLogins l
                ON l.UserAccountID = a.ID
        WHERE a.ID = @v_useraccountid;

        --get user dashboard data and time punches configuration, if assigned.
        IF ISNULL(@v_afterpswrecovering, 0) = 0 --do not give dashbord data, if user is authenticated with temp password after password recovering
        BEGIN
            EXEC @v_statuscode = dbo.Dashboard_Get @v_useraccountid;
        END;
    END;

    SET NOCOUNT OFF;
END;



