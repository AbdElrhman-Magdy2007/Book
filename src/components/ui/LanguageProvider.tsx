import React, { type ReactNode, useState } from "react";

type Language = "en" | "ar" | "fr" | "es";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  dir: "ltr" | "rtl";
}

const LanguageContext = React.createContext<LanguageContextType>({
  language: "en",
  setLanguage: () => {},
  dir: "ltr",
});

export const useLanguage = () => React.useContext(LanguageContext);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguage] = useState<Language>("en");

  const dir = language === "ar" ? "rtl" : "ltr";

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
        dir,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};
