import React, { useEffect } from "react";
import "./WikipediaPageView.css";

interface Props {
  wikiHtml: string;
}

function WikipediaPageView(props: Props) {
  const getHtml = () => {
    return { __html: props.wikiHtml };
  };

  return (
    <div
      className="WikipediaPageView"
      dangerouslySetInnerHTML={getHtml()}
    ></div>
  );
}

export default WikipediaPageView;
