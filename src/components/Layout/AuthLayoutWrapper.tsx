import { Image } from "antd";
import React, { FC, ReactNode, useEffect, useRef, useState } from "react";

interface AuthLayoutProps {
  children: ReactNode;
  title?: string;
  subtitle?: string;
}

const AuthLayoutWrapper: FC<AuthLayoutProps> = ({ children }) => {
  const imageRef = useRef<HTMLImageElement>(null);
  const [containerWidth, setContainerWidth] = useState<string>("70%");
  useEffect(() => {
    const updateContainerWidth = () => {
      if (imageRef.current) {
        const imageWidth = imageRef.current.clientWidth;
        setContainerWidth(`${imageWidth}px`);
      }
    };

    updateContainerWidth();
    window.addEventListener("resize", updateContainerWidth);

    return () => {
      window.removeEventListener("resize", updateContainerWidth);
    };
  }, []);
  return (
    <div>
      <div
        className={`auth-layout min-h-[100vh] w-full flex flex-row item-center justify-between items-center p-[15px] overflow-y-hidden`}
      >
        <div className="auth-sidebar-image flex justify-center items-center w-[50%]">
          <Image
            src="/images/auth-image2.png"
            alt="auth-image"
            preview={false}
            className="skillo-img"
          />
        </div>
        <div className="w-[50%] flex justify-center items-center mt-6">
          <div className="flex justify-center py-[20px] text-center">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthLayoutWrapper;
