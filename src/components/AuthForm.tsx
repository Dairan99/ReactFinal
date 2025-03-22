import { useState } from "react";
import { LoginForm } from "./LoginForm";
import { RegisterForm } from "./RegisterForm";

const AuthForm = () => {
  const [authType, setAuthType] = useState<string>("auth");

  return (
    <div className="header__form">
      {authType === "register" ? (
        <RegisterForm 
          setAuthType={setAuthType} 
        />
      ) : (
        <LoginForm 
          setAuthType={setAuthType}
        />
      )}
    </div>
  );
}

export default AuthForm;