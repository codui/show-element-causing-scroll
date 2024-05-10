'use strict';


function showWhichElementCausesHorizontalScroll() {

    // We create an array from the object containing page elements.
    let listTags = Array.from(document.body.children);
    // Remove the script tag from the array.
    listTags.splice(-1, 1);
    // Counter of elements to which the script has assigned a colored border.
    let countOfPaintBorder = 0;
    // console.log(listTags, listTags[0].children, listTags.length);



    function insertCssClassAndPropInUserStyleSheet( cssClassName = 'some-css-class', cssPropKeyValue = "color: red;" ) {
        let cssClassAndPropderty = `.${cssClassName} { 
            ${cssPropKeyValue}
        }`;
        // Get the site's style sheet.
        let cssSheet = null;
        // Number of CSS style sheet rules.
        let lengthCssSheet = 0;
        try {
            // Get the site's style sheet.
            cssSheet = document.styleSheets[0];
            // Number of CSS style sheet rules.
            lengthCssSheet = cssSheet.cssRules.length;
        } catch (err) {
            // alert('The index.html does not contain tag <link rel="stylesheet" href="name-file.css">');
            console.log(err);
        }
        // Insert the created class at the end of the style sheet.
        cssSheet.insertRule(cssClassAndPropderty, lengthCssSheet);
        // console.log('cssSheet.cssRules ', cssSheet.cssRules);
    }


    let cssClassName = "scroll-element-border";
    insertCssClassAndPropInUserStyleSheet(cssClassName, "border: 1px solid red;");


    function makeButton() {
        let button = document.createElement('button');
        let btnCssClass = "btn-controller";
        let btnCssProp = `
            position: absolute;
            left: 2%;
            bottom: 10%;
            min-width: 200px;
            max-width: 280px;
            z-index: 5;
            color: black;
            border: 1px solid blue;
            border-radius: 14px;
            padding: 1rem;
            outline: none;
            font-size: 1.2rem;
            font-weight: bold;
            background: blueviolet;
        `;
        button.innerHTML = "Toggle border of all html elements";
        button.className = btnCssClass;
        insertCssClassAndPropInUserStyleSheet(btnCssClass, btnCssProp);
        document.body.append(button);
        return button;
    }


    /** 
    * A recursive function that sets a colored border to page elements.
    * The function goes through all elements of the page and assigns
    * to their general list, a previously created class with a colored border.
    */

    function setBorderToElement(listTags) {
        // HTML page element.
        let tag = listTags[0] || listTags;
        // console.log(listTags, tag, tag.children, tag.children.length);

        // IF tag name = script - do not paint border
        if (tag.nodeName === 'SCRIPT') {
            return;
        } else {
            tag.classList.toggle(cssClassName); // tag.style.border = "1px solid red";
            ++countOfPaintBorder;
            if (tag.children.length !== 0) {
                setBorderToElement(tag.children);
                // console.log(tag, tag.children, tag.nextElementSibling);
            }
            if (tag.nextElementSibling !== null) {
                setBorderToElement(tag.nextElementSibling);
            }
        }
        return;
    };


    let btnControlBorder = makeButton();

    btnControlBorder.addEventListener("click", function () {
        setBorderToElement(listTags);
        console.log(countOfPaintBorder);
        countOfPaintBorder = 0;
    })

    return;
}


showWhichElementCausesHorizontalScroll();