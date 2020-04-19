import React, { useEffect } from "react";
import "./WikipediaPageView.css";

interface Props {
  wikiHtml: string;
  onWikiClick: (page: string) => void;
}

interface WikiLink {
  title: string;
  page: string;
  element: HTMLElement;
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
    let wikiLinks: HTMLElement[] = [];
    for (let element of links) {
      const htmlElement = element as HTMLElement;
      const link = htmlElement.getAttribute("href")!;
      const regexp: RegExp = /\/wiki\/(.*)/;
      const results: string[] = regexp.exec(link) as string[];
      if (results) {
        htmlElement.onclick = onWikiClick(results[1]);
        wikiLinks.push(htmlElement);
      }
    }

    return () => {
      wikiLinks.forEach((element) => (element.onclick = null));
      wikiLinks = [];
    };
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
