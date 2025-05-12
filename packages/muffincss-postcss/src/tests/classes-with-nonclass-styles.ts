export const styleSheetWithMediaQueryAndSelectorsInput = `
@muffincss;

.button {
background-color:red;
color:blue
}
button {
  color: red;
}
`;

export const styleSheetWithMediaQueryAndSelectorsOutput = `
@layer utilities {
  .a-background-color-red {
    background-color: red
  }
  .a-color-blue {
    color: blue
  }
}

button {
  color: red
}
  `.replace(/\s+/g, "");
