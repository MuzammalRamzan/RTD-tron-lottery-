import DocViewer from "react-doc-viewer";
import FileViewer from "react-file-viewer";
// // import { CustomErrorComponent } from 'custom-error';
import { PDFRenderer, PNGRenderer, MSDocRenderer } from "react-doc-viewer";
import "./explore.css";
import { useState } from "react";
import { useEffect } from "react";

import { useTranslation } from "react-i18next";
import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import Backend from "i18next-http-backend";
import LanguageDetector from "i18next-browser-languagedetector";
function Explore() {
  const { t, i18n } = useTranslation();

  const [dox, setDox] = useState("/assets/FQAs.pdf");
  const [cdox, setcDox] = useState("/assets/CFQAs.pdf");
  const [fdox, setfDox] = useState("/assets/F-FQAs.pdf");
  const [kdox, setkDox] = useState("/assets/K-FQAs.pdf");
  const [sdox, setsDox] = useState("/assets/S-FQAs.pdf");
  const [doc, setDocs] = useState({
    fileType: "application/pdf",
    uri: dox,
  });

  useEffect(() => {
    checkDox();
  }, []);

  const checkDox = () => {
    let res = i18n.use(LanguageDetector);
    var lang = res.language;

    switch (lang) {
      case "en":
        setDocs({
          fileType: "application/pdf",
          uri: dox,
        });

        break;
      case "sp":
        setDocs({
          fileType: "application/pdf",
          uri: sdox,
        });
        break;
      case "fr":
        setDocs({
          fileType: "application/pdf",
          uri: fdox,
        });
        break;
      case "chi":
        setDocs({
          fileType: "application/pdf",
          uri: cdox,
        });
        break;
      case "ko":
        setDocs({
          fileType: "application/pdf",
          uri: kdox,
        });
        break;
    }
  };

  const docs = [
    {
      fileType: "application/pdf",
      uri: doc,
    },
  ];
  return (
    <DocViewer
      documents={docs}
      config={{
        header: {
          disableHeader: true,
          disableFileName: true,
          retainURLParams: true,
        },
      }}
      weight={2}
      pluginRenderers={[PDFRenderer, PNGRenderer]}
    />
  );
}
export default Explore;
