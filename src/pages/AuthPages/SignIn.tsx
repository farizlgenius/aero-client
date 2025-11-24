import { PropsWithChildren } from "react";
import { SignInForm } from "../../components/auth/SignInForm";
import { LoginDto } from "../../model/Auth/LoginDto";
import AuthLayout from "./AuthPageLayout";

interface SignInProp {
  setDto: React.Dispatch<React.SetStateAction<LoginDto>>;
  handleClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

export const SignIn: React.FC<PropsWithChildren<SignInProp>> = ({ setDto, handleClick }) => {
  return (
    <>
      <AuthLayout>
        <SignInForm setDto={setDto} handleClick={handleClick} />
      </AuthLayout>
    </>
  );
}
