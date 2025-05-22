namespace EcotimeMobileAPI.CommonClasses
{
    internal static class Constants
    {
        #region cache related constants
        internal const string AppMessagesCacheKey = "AppMessages";
        internal const string PasswordConfigCacheKey = "PassowrdConfiguraion";
        internal const string AlertControlCacheKey = "EmailConfiguraion";
        #endregion

        #region email related constants
        internal const string SubjectForConfirmCodeEmail = "Registration Confirmation Code.";
        internal const string SubjectForPasswordRecovery  = "Password Recovery.";
        internal const string SubjectForAccountActivation  = "Account Activation.";
        internal const string SubjectForUsernameRecovery = "Username Recovery.";
        internal const string SubjectForPunchActivityFailure = "Punch Attempt Failed.";
        internal const string SubjectForGeofenceRestriction = "Geofence Warning Alert";

        #endregion

        #region template related constants
        internal const string EmailTemplatePathForConfirmPassword = "/Templates/ConfirmPasswordTemplate.html";
        internal const string EmailTemplatePathForRecoverPassword = "/Templates/RecoverPasswordTemplate.html";
        internal const string EmailTemplatePathForRecoverUsername = "/Templates/RecoverUsernameTemplate.html";
        internal const string EmailTemplatePathForPunchActivityFailure = "/Templates/PunchActivityFailureTemplate.html";
        internal const string EmailTemplatePathForGeofenceRestriction = "/Templates/GeofenceRestrictionTemplate.html";

        #endregion

        #region saml related constants
        internal const string EmployeeNumber = "employeenumber";
        #endregion
    }
}