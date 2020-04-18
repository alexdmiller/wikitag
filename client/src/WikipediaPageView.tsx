import React, { useEffect } from "react";
import "./WikipediaPageView.css";

interface Props {
  wikiHtml: string;
  onWikiClick: (page: string) => void;
}

function WikipediaPageView(props: Props) {
  const getHtml = () => {
    return { __html: props.wikiHtml };
  };

  const onWikiClick = (page: string) => (event: MouseEvent) => {
    event.preventDefault();
    props.onWikiClick(page);
  };

  useEffect(() => {
    const links: any = document
      .getElementById("wiki-view")
      ?.getElementsByTagName("a")!;
    console.log(links.length);
    for (let element of links) {
      const htmlElement = element as HTMLElement;
      const link = htmlElement.getAttribute("href")!;
      const regexp: RegExp = /\/wiki\/(.*)/;
      const results: string[] = regexp.exec(link) as string[];
      if (results) {
        const title = htmlElement.getAttribute("title");
        htmlElement.onclick = onWikiClick(results[1]);
      }
    }
  });

  return (
    <div
      id="wiki-view"
      className="WikipediaPageView"
      dangerouslySetInnerHTML={getHtml()}
    ></div>
  );
}

export default WikipediaPageView;
