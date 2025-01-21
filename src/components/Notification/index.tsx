import React, {createContext, useContext, ReactNode} from "react";
import {notification, notification as antdNotification, Typography} from "antd";
// import Error from "../../pages/Error";

// Define the type for the notification context
type NotificationContextType = {
  handleNotifications: (
    type: "success" | "info" | "warning" | "error",
    message: string,
    description: string,
    duration: number
  ) => void;
};

const NotificationContext = createContext<NotificationContextType | undefined>(
  undefined
);
 
export const useNotification = () => {
  const context = useContext(NotificationContext);
  return context;
};

type NotificationProviderProps = {
  children: ReactNode;
};

export const NotificationProvider: React.FC<NotificationProviderProps> = ({
  children,
}) => {
  const handleNotifications = (
    type: "success" | "info" | "warning" | "error",
    message: string,
    description: string,
    duration: number
  ) => {
    antdNotification[type]({
      message: (
        <span style={{fontWeight: "bold", marginRight: "5px"}}>{message}</span>
      ),
      key: message,
      description,
      duration,
    });
  };
  return (
    <NotificationContext.Provider value={{handleNotifications}}>
      {children}
    </NotificationContext.Provider>
  );
};
