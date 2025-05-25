export const input = {
  css: `
@muffincss;
.box {
  width: 150px;
}

@media (max-width: 600px) {
  .box {
    background: lightcoral;
  }
}
`,
  js: `
<div className={css(["box"])}>
  Hello
</div>;
  `,
};

export const output = {
  css: `@layer utilities {
  @media (max-width: 600px) {
    .a-e910d6a6 {
      background: #f08080;
    }
  }
  .a-b864ee35 {
    width: 150px;
  }
}
`,
  js: `
  <div class="a-e910d6a6  a-b864ee35">Hello</div>;
    `,
};
