function insertClassAndRulesToStyleTag(cssClassDragElement, cssRulesDragElement) {
    let headTag = document.querySelector('head');
    let styleTag = headTag.querySelector('#styleTag');

    let cssClassPropDragElement = `
        .${cssClassDragElement} {
            ${cssRulesDragElement}
        }`;
    // If there is no stylesheet in the head tag
    if (!styleTag) {
        styleTag = document.createElement('style');
        styleTag.setAttribute("id", "styleTag");
        styleTag.append(cssClassPropDragElement);
        headTag.append(styleTag);
    } else if (styleTag) {
        styleTag.append(cssClassPropDragElement);
    }
}

export { insertClassAndRulesToStyleTag };