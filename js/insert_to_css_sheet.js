function insertCssClassAndRuleInUserStylesheet(cssClassName = "some-css-element", cssRule="border: 1px solid red;") {
    let cssSheet = document.styleSheets[0];
    // Number of CSS style sheet rules
    let numberCssRuleInStylesheet = 0;
    let cssClassAndRules = `.${cssClassName} {
        ${cssRule}
    }`;
    if (cssSheet) {
        numberCssRuleInStylesheet = cssSheet.cssRules.length;
        cssSheet.insertRule(cssClassAndRules, numberCssRuleInStylesheet)
    }
}

export {insertCssClassAndRuleInUserStylesheet};