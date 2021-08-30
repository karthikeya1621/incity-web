import React from "react";
import { useStaticContent } from "../hooks";

const TermsPage = () => {
  const { data } = useStaticContent(
    "https://admin.incity-services.com/RestApi/api/termsandcondition?key=incitykey!"
  );

  return (
    <div className="termspage contentpage">
      <div className="w-full max-w-screen-lg mx-auto">
        <div
          className="content prose-lg"
          dangerouslySetInnerHTML={{
            __html: data,
          }}
        ></div>
      </div>
    </div>
  );
};

export default TermsPage;
