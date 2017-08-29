module.exports = {
    systemError: {
        statusCode: 500,
        status: 'error',
        message: 'Technical error ! Please try again later.'
    },
    emailAlreadyExist: {
        statusCode: 103,
        status: 'warning',
        message: 'This email ID is already registered'
    },
    dateRangeError: {
        statusCode: 103,
        status: 'warning',
        message: 'Please enter a valid date of birth'
    },
    tokenExpired: {
        statusCode: 401,
        status: "warning",
        message: 'Session expired.'
    },
    emailNotRegistered: {
        statusCode: 103,
        status: "warning",
        message: 'Sorry !!! This email is not registered with us.'
    },
    resetPasswordExpired: {
        statusCode: 103,
        status: "warning",
        message: 'Your reset password link has been expired. Request for the new link again.'
    },
    idAndtokenNotMatch: {
        statusCode: 103,
        status: "warning",
        message: 'Given id and token do not match. Please enter valid id and token.'
    },
    idDoesNotExists: {
        statusCode: 103,
        status: "warning",
        message: 'User does not exists in the database.'
    },
    IncorrectPassword: {
        statusCode: 103,
        status: "warning",
        message: 'Password entered is incorrect.'
    },
    invalidCredentials: {
        statusCode: 103,
        status: "error",
        message: 'Incorrect credentials.'
    },
    suspended: {
        statusCode: 103,
        status: "warning",
        message: 'Account is suspended. Please contact administrator.'
    },
    deleted: {
        statusCode: 103,
        status: "warning",
        message: 'Account is deleted. Please contact administrator.'
    },
    linkExpired: {
        statusCode: 402,
        status: "warning",
        message: 'This link has expired, you may go to the application again and generate link on clicking resend link button.'
    },
    operationNotForSocialLogin: {
        statusCode: 106,
        status: "warning",
        message: 'You are registered using social app, you are not allowed to perform this operation.'
    },
    videoExtensionNotAllowed: {
        statusCode: 103,
        status: "warning",
        message: 'Only (mp4,flv,mpeg,avi,flv) videos are supported'
    },
    staticPlanExpired: {
        statusCode: 103,
        status: "warning",
        message: 'Your static plan for 1 month has expired. Kindly renew your plan to proceed further'
    },
    staticPlanVideoLimit: {
        statusCode: 103,
        status: "warning",
        message: 'You limit to upload video in static plan is reached.You cannot upload more.'
    },
    advancedPlanVideoLimit: {
        statusCode: 103,
        status: "warning",
        message: 'You limit to upload video in static plan is reached.You cannot upload more.'
    },
    accountNotVerified: {
        statusCode: 103,
        status: "warning",
        message: 'Your email is not verified.Please check your mail to verify your account'
    },
    unAuthorizedUser: {
        statusCode: 103,
        status: 'warning',
        message: 'You are not an authorized user'
    },
    categoryExist: {
        statusCode: 103,
        status: 'warning',
        message: 'Category already exists'
    },
    categoryNotExist: {
        statusCode: 103,
        status: 'warning',
        message: 'Category not exists'
    },
    imageExtensionNotAllowed: {
        statusCode: 103,
        status: "warning",
        message: 'Only (jpg,jpeg,png) images are supported'
    },
    accountNotVerifiedResendLink: {
        statusCode: 105,
        status: "warning",
        message: 'Your email ID is not verified. Verification link is sent to your email ID. \n You may resend the link by clicking on "Resend Link" button.'
    },
    emailNotExists: {
        statusCode: 103,
        status: "warning",
        message: 'Incorrect email.'
    },
    alreadyConfirmed: {
        statusCode: 103,
        status: "warning",
        message: 'Account is already confirmed, use login or forgot password to access your account.'
    },
    resetPasswordSuccessfull: {
        statusCode: 200,
        status: "success",
        message: "Password reset request generated."
    }

};
