export const mediaQueriesWithNonClassStylesInput = `
@media (min-width: 768px) {
  .header {
    text-align: center;
    color: blue;
  }
  button {
    color: blue;
  }
}
@media (min-width: 769px) {
  .header {
    color: yellow;
  }
}
`;

export const mediaQueriesWithNonClassStylesOutput = `
@media (min-width:768px){
  button{color:blue}
  .a-text-align-center-_min_width__768px_{text-align:center}
  .a-color-blue-_min_width__768px_{color:blue}
}
@media (min-width:769px){
  .a-color-yellow-_min_width__769px_{color:#ff0}
}
  
`.replace(/\s+/g, "");
