import { Tabs, TabList, Tab, TabPanel } from "react-aria-components";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { hopscotch as theme } from "react-syntax-highlighter/dist/esm/styles/prism";
import css from "~/_muffin/css";
import { input, output } from "./utils";

const tabData = [
  { id: "FoR", label: "input", content: input },
  { id: "MaR", label: "output", content: output },
];

const getTabClass = ({ isSelected }: { isSelected: boolean }) =>
  // todo: bug in muffin to detect data classes
  css(
    ["react-aria-Tab", isSelected && "react-aria-Tab-selected"].filter(
      (item): item is string => Boolean(item),
    ),
  );

const renderCodeBlocks = (code: { css: string; js: string }) => (
  <>
    <SyntaxHighlighter
      language="css"
      style={theme}
      customStyle={{ fontSize: "12px" }}
    >
      {code.css}
    </SyntaxHighlighter>

    <SyntaxHighlighter
      language="javascript"
      style={theme}
      customStyle={{ fontSize: "12px" }}
    >
      {code.js}
    </SyntaxHighlighter>
  </>
);

const CodeViewer = () => {
  return (
    <Tabs className={css(["react-aria-Tabs"])}>
      <TabList className={css(["react-aria-TabList"])} aria-label="Code Viewer">
        {tabData.map(({ id, label }) => (
          <Tab key={id} id={id} className={getTabClass}>
            {label}
          </Tab>
        ))}
      </TabList>

      {tabData.map(({ id, content }) => (
        <TabPanel key={id} id={id} className={css(["react-aria-TabPanel"])}>
          {renderCodeBlocks(content)}
        </TabPanel>
      ))}
    </Tabs>
  );
};

export default CodeViewer;
