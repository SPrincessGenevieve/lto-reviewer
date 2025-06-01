"use client";
import {
  createContext,
  useState,
  ReactNode,
  useContext,
  useEffect,
} from "react";

type Question = {
  question: string;
  choices: string[];
  image: string;
  isMultiple: boolean;
  answer?: string | string[];
};
type UserContextType = {
  isNonProfViolated: boolean;
  isProfViolated: boolean;
  profLevel: string;
  nonProfLevel: string;
  userAnswers: string[][]; // an array of string arrays (multiple answers per question)
  examQuestions: Question[];
  setUserDetails: (details: Partial<UserContextType>) => void;
  resetUserDetails: () => void;
};

const defaultUserContext: UserContextType = {
  isNonProfViolated: false,
  isProfViolated: false,
  profLevel: "",
  nonProfLevel: "",
  userAnswers: [],
  examQuestions: [],
  setUserDetails: () => {},
  resetUserDetails: () => {},
};

const UserContext = createContext<UserContextType>(defaultUserContext);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [userDetails, setUserDetailsState] =
    useState<UserContextType>(defaultUserContext);

  const resetUserDetails = () => {
    setUserDetailsState(defaultUserContext); // ✅ Correct: this truly resets the state
    localStorage.removeItem("userDetails"); // ✅ Also remove persisted data
  };

  useEffect(() => {
    const savedUserData = JSON.parse(
      localStorage.getItem("userDetails") || "{}"
    );
    setUserDetailsState((prev) => ({ ...prev, ...savedUserData }));
  }, []);

  const setUserDetails = (details: Partial<UserContextType>) => {
    const updatedUserDetails = { ...userDetails, ...details };

    // Check if the details have actually changed before updating
    if (JSON.stringify(updatedUserDetails) !== JSON.stringify(userDetails)) {
      setUserDetailsState(updatedUserDetails as UserContextType);
      localStorage.setItem("userDetails", JSON.stringify(updatedUserDetails));
    }
  };

  return (
    <UserContext.Provider
      value={{ ...userDetails, resetUserDetails, setUserDetails }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUserContext = () => useContext(UserContext);
