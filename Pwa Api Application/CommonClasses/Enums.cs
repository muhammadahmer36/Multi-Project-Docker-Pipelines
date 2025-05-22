namespace EcotimeMobileAPI.CommonClasses
{
    public enum eErrorMessageCode : int
    { 
        UnhandleMessagecode = -1,
        LoggedInSucessfull = 0, 
        AccountAllreadyExists = 2,
        PasswordExpired = 5,
        YourAccountIsDeactivated = 6,
        NoAccesForApplication = 11,
        NoAccesForRequestedResource = 15,
        InvalidCredentials = 31,
        RegistrationSuccessfull = 32,
        EmailDoesNotBelongToEmployee = 33,
        AccountIsNotConfirmed = 34,
        InvalidCode = 35,
        SendTempPasswordOnEmail = 36,
        InvalidTempPassword = 37,
        InvalidUsername = 38,
        PasswordUpdated = 39,
        PasswordConfigurationFails = 44,
        SendEmailForConfirmation = 40,
        PasswordDoesntExpire = 41,
        CannotSetPreviousPassword = 42,
        ForgotUsername = 43,
        ADAccountDoesntExists = 45,
        TimePunchingIsCreated = 47,
        NoAccesForTimePunching = 48,
        InvalidTimePunch = 49,
        TimePunchingFailed = 50,
        NoAccesForBalancing = 51,
        GeofenceSaveFailed = 62,
        GeofenceDeleteFailed = 60,
        GeofenceDeleteConflict = 61,
        FutureDateNotAllowed = 53,
        PunchHistoryDaysLimit = 54,
        InvalidDateRange = 55,
        NoGeofenceAssignedToResource = 56,
        NoGeofenceIsApplicable = 57,
        InvalidRefreshToken = 112,
        InvalidGeofenceID = 63,
        RequiredGeofenceID = 64,
        GeofencePolygonDeletedSuccess = 65,
        InvalidPolygon = 66,
        LatitudeIDMissing = 67,
        LongitudeIDMissing = 68,
        GeofencePolygonSuccess = 69,
        GeofenceUpdateFailed = 83,
        GeofenceCreatedSuccess = 71,
        GeofenceUpdateSuccess = 72,
        GeofenceRestrictionAlert = 76,
        GeofenceRestrictionAlertSuccess = 77,
        NoteCharactersLimitValidation = 79,
        GeofenceIsNotEnabled = 82
    }

    public enum Resource
    {
        TimePunches = 290,
        TimeOff = 289,
        Balances = 288,
    }

    public enum GeofenceRestriction
    {
        FullRestriction = 1,
        Warning = 2,
        Allowed = 3,
    }


    public enum eAuthenticationType: ushort
    {
        ApplicationBaseAuthentication = 0,
        ActiveDirectory = 1,
        SAML = 2
    }

    public enum ePunchType: ushort { In = 1, Out = 2, Transfer = 3 }
    public enum eResponseMessageStatusType: ushort { success, info, warining, error }
}
