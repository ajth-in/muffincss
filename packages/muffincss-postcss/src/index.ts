import { atRule, rule, type AcceptedPlugin, type PluginCreator } from "postcss";
import fg from 'fast-glob';
import globParent from 'glob-parent';
import fs from 'fs';
import path from 'path';
import type Declaration_ from "postcss/lib/declaration";
import { getCompressedUniqueHash } from "./hash";
import { getResetStyles } from "./resets";

export type PluginOptions = {
  // The base directory to scan for class candidates.
  base?: string;
  content:string[],
  // Optimize and minify the output CSS.
  optimize?: boolean | { minify?: boolean };
};

function tailwindcss(opts: PluginOptions = {content:["src/**/*.bem.css"]}): AcceptedPlugin {
  return {
    postcssPlugin: "@muffincss/postcss",

    async Root(root, { result }) {
  
      const demandedStyles:Array<{selector:string, decl:Declaration_}> = []
      const selectorsSet = new Set<string>()
      console.log(__dirname);
      root.walkRules(rule=>{
        if(rule.selector.startsWith(".")){
        rule.walkDecls(decl => {
          const selector = getCompressedUniqueHash(decl.value)
          if(!selectorsSet.has(selector)) demandedStyles.push({selector, decl} )
          selectorsSet.add(selector)
        });
        rule.remove()
      }
      })
      console.log("STYLES",demandedStyles.map(({selector,decl})=>{
        return{selector, value:decl.prop + ":" + decl.value}
      }))
      const newRules = demandedStyles.map(({selector, decl}) => {
        const newRule = rule({ selector: `.${selector}` });
        
        newRule.append({ prop: decl.prop, value: decl.value });
        return newRule
      })
      root.walkAtRules('tailwind', node => {
           // resetting the styles
          const resetLayer = atRule({name:"layer", params:"reset"})
          getResetStyles().map(style=>resetLayer.append(style))
          node.replaceWith(resetLayer,newRules)
          node.remove()
      
      });
      function watchFile(file:string) {
        result.messages.push({
          plugin: 'tailwindcss',
          parent: result.opts.from,
          type: 'dependency',
          file,
        })
      }
      // root.walkDecls(decl => {
      //   demandedStyles[getCompressedUniqueHash(decl.value)] = decl  
      // });
   
      // })
     
    

    
      function watchDir(dir:string, glob:string) {
        result.messages.push({
          plugin: 'tailwindcss',
          parent: result.opts.from,
          type: 'dir-dependency',
          dir,
          glob, // Webpack ignores this, but other tools like Vite use it when present.
        })
      }
      let files = fg.sync(opts.content)

      for (let pattern of opts.content) {
        let { base, glob } = parseGlob(pattern)
        watchDir(base, glob)
      }

      for (let file of files) {
        let contents = fs.readFileSync(path.resolve(__dirname, file), 'utf8')
        // NOTE: Details here are not important, most important part is that we can "read" the files.
        // In reality this is a lot more complicated but it doesn't matter for this proof-of-concept.
        // console.log("Content",contents);
        
        // for (let candidate of contents.split(/['"\s<>=/]/g)) {
        //   candidates.add(candidate)
        // }
      }




    },
  };
}

export default Object.assign(tailwindcss, {
  postcss: true,
}) as PluginCreator<PluginOptions>;

export function parseGlob(pattern:string) {
  let glob = pattern
  let base = globParent(pattern)

  if (base !== '.') {
    glob = pattern.substr(base.length)
    if (glob.charAt(0) === '/') {
      glob = glob.substr(1)
    }
  }

  if (glob.substr(0, 2) === './') {
    glob = glob.substr(2)
  }
  if (glob.charAt(0) === '/') {
    glob = glob.substr(1)
  }

  return { base, glob }
}