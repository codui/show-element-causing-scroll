'use strict';


function insertClassAndRulesToStyleTag(cssClassDragElement, cssRulesDragElement) {
    let headTag = document.querySelector('head');
    let styleTag = headTag.querySelector('#styleTag');

    let cssClassPropDragElement = `.${cssClassDragElement} {${cssRulesDragElement}}`;
    // If there is no stylesheet in the head tag
    if (!styleTag) {
        styleTag = document.createElement('style');
        styleTag.setAttribute("id", "styleTag");
        styleTag.textContent = cssClassPropDragElement;
        headTag.append(styleTag);
    } else if (styleTag) {
        styleTag.append(cssClassPropDragElement);
    }
}


function preparingWrapperForDragDrop() {
    let cssClassDragElement = "drag-element";
    let cssRulesDragElement = `
        min-width: 100px;
        max-width: 200px;
        width: 100%;
        min-height: 100px;
        display: flex;
        justify-content: center;
        align-items: center;
        background: rgba(0, 0, 0, 0.1);
        border: 1px solid blueviolet;
        border-radius: 5px;
        position: absolute;
        z-index: 9998;
        cursor: grab;
        user-select: none;
        box-shadow: 0 3px 1px -2px #ccc, 0 2px 2px 0 #ccc, 0 1px 5px 0 #ccc;
        transition: box-shadow 0.3s, border 0.3s, background 0.3s ease;`
    let bodyTag = document.querySelector('body');
    let divTag = document.createElement('div');
    let arrDragElements = [];

    divTag.classList.add(cssClassDragElement);
    arrDragElements.push(bodyTag, divTag);

    insertClassAndRulesToStyleTag(cssClassDragElement, cssRulesDragElement);
    insertClassAndRulesToStyleTag(`${cssClassDragElement}:hover`, "border: 1px solid green;");
    insertClassAndRulesToStyleTag(`${cssClassDragElement}:active`, `border: none;
        background: rgba(0, 0, 0, 0);
        box-shadow: 0 4px 2px -3px #ccc, 0 4px 5px 1px #ccc, 0 2px 7px 1px #ccc;`);
    insertClassAndRulesToStyleTag(`${cssClassDragElement}:active .btn-controller`, `border: none;
        background:  rgba(0, 0, 0, 0); 
        color: rgba(0, 0, 0, 0);
        transform: scale(1.02, 1.02);`);

    bodyTag.append(divTag);
    return arrDragElements;
}


function createDragDrop(button) {
    let arrElementsForDragDrop = preparingWrapperForDragDrop(); // array [dragZone, dragElement]
    let dragZone = arrElementsForDragDrop[0];
    let dragElement = arrElementsForDragDrop[1];
    // Inserting an external function control button
    dragElement.append(button);


    function moveElement(pageX, pageY, shiftCursorX, shiftCursorY) {
        // Checking that the inserted block does not create a horizontal scroll
        if ((pageX - shiftCursorX) >= 0 &&
            (pageX - shiftCursorX) + dragElement.offsetWidth <= window.visualViewport.width) {
                dragElement.style.left = pageX - shiftCursorX + "px";
                dragElement.style.top = pageY - shiftCursorY + "px";
        }
    };


    dragElement.addEventListener("mousedown", function (event) {

        if (event.target === button) {
            return;
        }

        dragElement.style.cursor = "grabbing";
        // Save the coordinates of the cursor relative to the dragged element
        let shiftCursorX = event.pageX - dragElement.getBoundingClientRect().left;
        let shiftCursorY = event.pageY - dragElement.getBoundingClientRect().top;

        // Move drag element under cursor
        moveElement(event.pageX, event.pageY, shiftCursorX, shiftCursorY);

        function onMouseMove(event) {
            moveElement(event.pageX, event.pageY, shiftCursorX, shiftCursorY);
        }

        document.addEventListener('mousemove', onMouseMove);

        dragElement.addEventListener('mouseup', function () {
            dragElement.style.cursor = "grab";
            document.removeEventListener('mousemove', onMouseMove);
        })
    });

    dragElement.ondragstart = function () {
        return false;
    };
}


function showWhichElementCausesHorizontalScroll() {
    // Create an array from the object containing page elements
    let listTags = Array.from(document.body.children);
    // Remove the script tag from the array
    listTags.splice(-1, 1);
    let cssClassName = "element-with-border";
    let btnControlBorder = null;

    // Insert style for element with border
    insertClassAndRulesToStyleTag(cssClassName, `
        border: 1px solid red;`);


    function makeButton() {
        let button = document.createElement('button');

        let cssClassBtn = "btn-controller";
        let cssRulesBtn = `
        min-width: 100px;
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
        user-select: none;
        background: rgba(138, 43, 226, 0.3); 
        transition: border 0.3s, background 0.3s, color 0.3s, transform 0.3s ease;`;
        button.innerHTML = `Toggle border all elements`;
        button.className = cssClassBtn;
        insertClassAndRulesToStyleTag(cssClassBtn, cssRulesBtn);
        return button;
    }

    btnControlBorder = makeButton();
    
    createDragDrop(btnControlBorder);

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