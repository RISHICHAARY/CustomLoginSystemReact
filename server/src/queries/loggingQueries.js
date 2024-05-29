const getLoginStatus = "SELECT * FROM EMPLOYEES WHERE EMAIL = $1";
const registerUser = "INSERT INTO EMPLOYEES ( type,active,photo,firstname,lastname,dob,gender,email,mobile,address,role,status,password ) VALUES( $1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13 )";
const getUser = "SELECT FIRSTNAME,EMAIL FROM EMPLOYEES WHERE EMAIL = $1";
const updatePassword = "UPDATE EMPLOYEES SET PASSWORD = $1, ACTIVE = true WHERE EMAIL = $2"

module.exports = {
    getLoginStatus,
    registerUser,
    getUser,
    updatePassword
}