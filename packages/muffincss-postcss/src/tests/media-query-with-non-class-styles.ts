export const mediaQueriesWithNonClassStylesInput = `
@muffincss;

.header {
  color:yellow
}
@media (min-width: 768px) {
  .header {
    text-align: center;
    color: blue;
  }

  button {
    color: blue;
  }
}
`;

export const mediaQueriesWithNonClassStylesOutput = `
@layer utilities {
  @media (min-width: 768px) {
    .a-text-align-center-_min_width__768px_ {
      text-align: center
    }
    .a-color-blue-_min_width__768px_ {
      color: blue
    }
  }
  .a-color-yellow {
    color: #ff0
  }
}

@media (min-width: 768px) {
  button {
    color: blue
  }
}
`.replace(/\s+/g, "");
