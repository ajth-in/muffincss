export const styleSheetWithMediaQueryAndSelectorsInput = `
.button {
  background-color: #007bff;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 16px;
}

button {
  color: red;
}

/* Media query for responsiveness */
@media (max-width: 600px) {
  .container {
    padding: 10px;
  }
}
`;

export const styleSheetWithMediaQueryAndSelectorsOutput = `
button {
  color: red
}

@media (max-width: 600px) {
  .a-padding-10px-_max_width__600px_ {
    padding: 10px
  }
}

.a-background-color-_007bff {
  background-color: #007bff
}

.a-color-white {
  color: #fff
}

.a-padding-10px_20px {
  padding: 10px 20px
}

.a-border-none {
  border: none
}

.a-border-radius-8px {
  border-radius: 8px
}

.a-cursor-pointer {
  cursor: pointer
}

.a-font-size-16px {
  font-size: 16px
}
`.replace(/\s+/g, "");
