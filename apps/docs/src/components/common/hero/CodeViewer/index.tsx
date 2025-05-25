import { Tabs, TabList, Tab, TabPanel } from "react-aria-components";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { a11yDark as theme } from "react-syntax-highlighter/dist/esm/styles/prism";
import css from "~/muffin/css";
import { input, output } from "./utils";
const codeString = `function greet(name) {
    return 'Hello, ' + name;
}
`;
const tabs = [
  { id: "FoR", label: "input" },
  { id: "MaR", label: "output" },
];

const getTabClass = ({ isSelected }: { isSelected: boolean }) =>
  css(
    isSelected
      ? ["react-aria-Tab", "react-aria-Tab-selected"]
      : ["react-aria-Tab"],
  );

const CodeViewer = () => {
  return (
    <Tabs className={css(["react-aria-Tabs"])}>
      <TabList className={css(["react-aria-TabList"])} aria-label="Code Viewer">
        {tabs.map(({ id, label }) => (
          <Tab key={id} id={id} className={getTabClass}>
            {label}
          </Tab>
        ))}
      </TabList>

      <TabPanel className={css(["react-aria-TabPanel"])} id="FoR">
        <SyntaxHighlighter
          language="css"
          style={theme}
          showLineNumbers
          customStyle={{ fontSize: "12px" }}
        >
          {input.css}
        </SyntaxHighlighter>
        <SyntaxHighlighter
          language="javascript"
          style={theme}
          showLineNumbers
          customStyle={{ fontSize: "12px" }}
        >
          {input.js}
        </SyntaxHighlighter>
      </TabPanel>

      <TabPanel className={css(["react-aria-TabPanel"])} id="MaR">
        <SyntaxHighlighter
          language="css"
          style={theme}
          showLineNumbers
          customStyle={{ fontSize: "12px" }}
        >
          {output.css}
        </SyntaxHighlighter>
        <SyntaxHighlighter
          language="javascript"
          style={theme}
          showLineNumbers
          customStyle={{ fontSize: "12px" }}
        >
          {output.js}
        </SyntaxHighlighter>
      </TabPanel>
    </Tabs>
  );
};

export default CodeViewer;
