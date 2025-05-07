import postcss from "postcss";

const styleRules = [
    {
      selector: '*, *::before, *::after',
      declarations: { 'box-sizing': 'border-box' },
    },
    {
      selector: '*',
      declarations: { margin: '0', padding:0 },
    },
    {
      atRule: {
        name: 'media',
        params: '(prefers-reduced-motion: no-preference)',
        rules: [
          {
            selector: 'html',
            declarations: { 'interpolate-size': 'allow-keywords' },
          },
        ],
      },
    },
    {
      selector: 'body',
      declarations: {
        'line-height': '1.5',
        '-webkit-font-smoothing': 'antialiased',
      },
    },
    {
      selector: 'img, picture, video, canvas, svg',
      declarations: {
        display: 'block',
        'max-width': '100%',
      },
    },
    {
      selector: 'input, button, textarea, select',
      declarations: { font: 'inherit' },
    },
    {
      selector: 'p, h1, h2, h3, h4, h5, h6',
      declarations: { 'overflow-wrap': 'break-word' },
    },
    {
      selector: 'p',
      declarations: { 'text-wrap': 'pretty' },
    },
    {
      selector: 'h1, h2, h3, h4, h5, h6',
      declarations: { 'text-wrap': 'balance' },
    },
    {
      selector: '#root, #__next',
      declarations: { isolation: 'isolate' },
    },
  ];

export  const getResetStyles = () =>
    styleRules.map(entry => {
      if (entry.atRule) {
        const atRule = postcss.atRule({
          name: entry.atRule.name,
          params: entry.atRule.params,
        });
        entry.atRule.rules.forEach(rule => {
          const ruleNode = postcss.rule({ selector: rule.selector });
          for (const [prop, value] of Object.entries(rule.declarations)) {
            ruleNode.append(postcss.decl({ prop, value }));
          }
          atRule.append(ruleNode);
        });
        return atRule;
      } else {
        const rule = postcss.rule({ selector: entry.selector });
        for (const [prop, value] of Object.entries(entry.declarations)) {
          rule.append(postcss.decl({ prop, value }));
        }
        return rule;
      }
    });