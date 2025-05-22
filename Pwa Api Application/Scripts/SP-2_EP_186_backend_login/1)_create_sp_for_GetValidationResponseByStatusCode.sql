
CREATE PROCEDURE GetValidationResponseByStatusCode
@statusCode INT
AS
BEGIN
	SELECT ID 'StatusCode', Title 'StatusMessage' FROM AppMessages WHERE ID = @statusCode
END
GO
