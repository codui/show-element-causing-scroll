'use strict';
import {insertClassAndRulesToStyleTag} from './insert_to_style_tag.js';


function preparingWrapperForDragDrop(cssClassDragElement = "drag-element", 
    cssRulesDragElement = `min-width: 100px;
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
            box-shadow: 0 3px 1px -2px #ccc, 0 2px 2px 0 #ccc, 0 1px 5px 0 #ccc;
            transition: box-shadow 0.3s, border 0.3s, background 0.3s ease;`) {
    
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
    // insertClassAndRulesToStyleTag();

    bodyTag.append(divTag);

    return arrDragElements;
}


function getDragDrop(button) {

    let arrElementsForDragDrop = preparingWrapperForDragDrop(); // array [dragZone, dragElement]
    let dragZone = arrElementsForDragDrop[0];
    let dragElement = arrElementsForDragDrop[1];
    // Inserting an external function control button
    dragElement.append(button);


    function moveElement(pageX, pageY, shiftCursorX, shiftCursorY) {
        // Проверка того что вставленный блок не создаёт горизонтальный скролл
        if ((pageX - shiftCursorX) >= 0 &&
            (pageX - shiftCursorX) + dragElement.offsetWidth <= window.visualViewport.width) {
                dragElement.style.left = pageX - shiftCursorX + "px";
                dragElement.style.top = pageY - shiftCursorY + "px";
        }
    };


    dragElement.addEventListener("mousedown", function (event) {
        // console.log(event.target.className);

        dragElement.style.cursor = "grabbing";
        // Save the coordinates of the cursor relative to the dragged element
        let shiftCursorX = event.pageX - dragElement.getBoundingClientRect().left;
        let shiftCursorY = event.pageY - dragElement.getBoundingClientRect().top;

        // Move drag element under cursor
        moveElement(event.pageX, event.pageY, shiftCursorX, shiftCursorY);

        function onMouseMove(event) {
            console.log(event.target);
            if (event.target !== button) {
                moveElement(event.pageX, event.pageY, shiftCursorX, shiftCursorY);
            }
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

    // return dragElement;
}