'use strict';
import {
    getDragDrop,
    preparingWrapperForDragDrop
} from './drag_drop.js';
import {insertClassAndRulesToStyleTag} from './insert_to_style_tag.js';


function showWhichElementCausesHorizontalScroll() {

    // Create an array from the object containing page elements
    let listTags = Array.from(document.body.children);
    // Remove the script tag from the array
    listTags.splice(-1, 1);
    let cssClassName = "element-with-border";
    let btnControlBorder = null;

    // Insert style for element with border
    insertClassAndRulesToStyleTag(cssClassName, "border: 1px solid red;");


    function makeButton() {
        let button = document.createElement('button');

        let cssClassBtn = "btn-controller";
        let cssRulesBtn = `min-width: 100px;
            max-width: 130px;
            z-index: 9999;
            color: black;
            border: 1px solid blue;
            border-radius: 14px;
            padding: 0.5rem;
            outline: none;
            font-size: 1.2rem;
            font-weight: bold;
            cursor: pointer;
            background: rgba(138, 43, 226, 0.3); 
            transition: border 0.3s, background 0.3s, color 0.3s, transform 0.3s ease;`;
        button.innerHTML = `Toggle border all elements`;
        button.className = cssClassBtn;
        insertClassAndRulesToStyleTag(cssClassBtn, cssRulesBtn);
        return button;
    }

    btnControlBorder = makeButton();
    
    getDragDrop(btnControlBorder);

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


    btnControlBorder.addEventListener("click", function () {
        setBorderToElement(listTags);
    })
    return;
}


showWhichElementCausesHorizontalScroll();