import { useState } from "react";
import { ReactMultiEmail } from "react-multi-email";
import "react-multi-email/dist/style.css";

import { GiCancel } from "react-icons/gi";

interface MultiEmailInputProps {
  emails: string[];
  setEmails: (emails: string[]) => void;
  focus?: boolean;
}

const MultiEmail = ({
  emails,
  setEmails,
  focus = false,
}: MultiEmailInputProps) => {
  const [focused, setFocused] = useState(false);

  return (
    <div className="multi-email-container">
      <ReactMultiEmail
       className="email-input textarea-style" 
        placeholder="Input your email and press enter"
        emails={emails}
        onChange={(_emails: string[]) => {
          setEmails(_emails);
        }}
        autoFocus={focus}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        validateEmail={(email: string) => {
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          return emailRegex.test(email);
        }}
        getLabel={(email: string, index: number, removeEmail: (index: number) => void) => {
          return (
            <div data-tag key={index} className="email-tag">
              <span>{email}</span>
              <span data-tag-handle onClick={() => removeEmail(index)} className="remove-email">
                <GiCancel />
              </span>
            </div>
          );
        }}
      />
    </div>
  );
};

export default MultiEmail;
