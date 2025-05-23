USE [HBS_EcoMobile]
GO
/****** Object:  StoredProcedure [dbo].[PswValidatorParameters_Get]    Script Date: 10/12/2023 2:04:57 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
/*-- =============================================
-- Client:		HBS EcoMobile
-- Created:		10/10/2019 RD
-- Description:	get password validations, based on identity.options
				HBS_wireframes_v2.3.pdf page#8,13 - "Application based Create a new Account"/"Set New Password"
-- =============================================*/
ALTER PROCEDURE [dbo].[PswValidatorParameters_Get]
AS
BEGIN	
	SET NOCOUNT ON;

	--SELECT 0 AS statuscode, '' AS statusmessage

	SELECT  CAST( CASE WHEN ISNULL(pwNoOfNumbers,0) > 0 THEN 1 ELSE 0 END AS BIT) AS RequireDigits,
			ISNULL(pwdRequireLowerCase, 0) AS RequireLowerCase,
			ISNULL(pwdRequireUpperCase, 0) AS RequireUpperCase,
			CAST(CASE WHEN ISNULL(pwNoOfSpecialChar,0) > 0 THEN 1 ELSE 0 END AS BIT) AS RequireSpecialChars,			
			pwminimum AS MinPwdLength,
			pwlimit AS MaxPwdLength,
			pwNoOfSpecialChar AS MinNoOfSpecialCharacter,
			pwNoOfNumbers AS MinNoOfDigits,
			'' AS NotAllowedCharacters
	FROM control

    SET NOCOUNT OFF;
END