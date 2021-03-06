import React from "react";
import { useStaticContent } from "../hooks";

const AboutPage = () => {
  const { data } = useStaticContent(
    "https://admin.incity-services.com/RestApi/api/aboutus?key=incitykey!"
  );

  return (
    <div className="aboutuspage contentpage">
      <div className="w-full max-w-screen-lg mx-auto">
        <div
          className="content prose-lg"
          dangerouslySetInnerHTML={{ __html: data }}
        ></div>
      </div>
    </div>
  );
};

export default AboutPage;
