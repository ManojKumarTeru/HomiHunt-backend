export interface SignupData {
  firstName: string;
  lastName: string;
  emailId: string;
  password: string;
}

const validateSignupData = (data: SignupData): void => {
  const { firstName, lastName, emailId, password } = data;

  if (!firstName || !lastName || !emailId || !password) {
    throw new Error("All fields are required.");
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(emailId)) {
    throw new Error("Invalid email format.");
  }

  if (password.length < 6) {
    throw new Error("Password must be at least 6 characters long.");
  }
};

export default validateSignupData;
