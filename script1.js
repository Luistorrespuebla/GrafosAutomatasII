const generarGrafo = () => {
    const expression = document.getElementById("expressionInput").value;

    const mensajes = document.getElementById("mensajes");
    mensajes.innerHTML = '';

    if (!expression) {
        documentWriteMessage("Por favor, ingrese una operación matemática.");
        return;
    }

    if (expression.match(/[\+\-\*\/]{2,}/)) {
        documentWriteMessage("Las operaciones no pueden tener operadores consecutivos.");
        return;
    }

    const ast = operadorM(expression.trim());
    if (ast) {
        visualizarGrafo(ast);
    } else {
        documentWriteMessage("Expresión no válida.");
    }
};

const documentWriteMessage = (mensaje) => {
    const mensajes = document.getElementById("mensajes");
    const messageElement = document.createElement("p");
    messageElement.textContent = mensaje;
    messageElement.style.color = "red"; 
    mensajes.appendChild(messageElement);
};

const operadorM = (expression) => {
    const operators = ['+', '-', '*', '/'];
    let operatorIndex = -1;
    let operator = null;

    expression = expression.trim();

    if (expression.includes('(')) {
        let parenBalance = 0;
        for (let i = 0; i < expression.length; i++) {
            const char = expression[i];
            if (char === '(') parenBalance++;
            if (char === ')') parenBalance--;

            if (parenBalance === 0 && operators.includes(char)) {
                operator = char;
                operatorIndex = i;
                break;
            }
        }
    }

    
    if (operatorIndex === -1) {
        for (let i = 0; i < operators.length; i++) {
            operatorIndex = expression.lastIndexOf(operators[i]);
            if (operatorIndex !== -1) {
                operator = operators[i];
                break;
            }
        }
    }

    if (operatorIndex === -1) {
        return {
            type: 'Literal',
            value: expression
        };
    }

    const left = expression.slice(0, operatorIndex).trim();
    const right = expression.slice(operatorIndex + 1).trim();

    const cleanedLeft = left.startsWith('(') && left.endsWith(')') ? left.slice(1, -1).trim() : left;
    const cleanedRight = right.startsWith('(') && right.endsWith(')') ? right.slice(1, -1).trim() : right;

    return {
        type: 'BinaryExpression',
        operator: operator,
        left: operadorM(cleanedLeft),  
        right: operadorM(cleanedRight)
    };
};

const visualizarGrafo = (ast) => {
    const treeContainer = document.getElementById('tree');
    treeContainer.innerHTML = ''; 
    const svgNS = "http://www.w3.org/2000/svg";
    const svg = document.createElementNS(svgNS, "svg");
    svg.setAttribute("width", "600");
    svg.setAttribute("height", "400");

    dibujarGrafo(svg, ast, 300, 50, 150, 100);

    treeContainer.appendChild(svg);
};

const dibujarGrafo = (svg, node, x, y, dx, dy) => {
    if (!node) return;

    const svgNS = "http://www.w3.org/2000/svg";

    const circle = document.createElementNS(svgNS, "circle");
    circle.setAttribute("cx", x);
    circle.setAttribute("cy", y);
    circle.setAttribute("r", 30);
    circle.setAttribute("fill", "#28a745");
    svg.appendChild(circle);

    const text = document.createElementNS(svgNS, "text");
    text.setAttribute("x", x);
    text.setAttribute("y", y + 5);
    text.setAttribute("text-anchor", "middle");
    text.setAttribute("fill", "white");
    text.setAttribute("font-size", "16px");
    text.textContent = node.operator || node.value.replace(/[()]/g, '');
    svg.appendChild(text);

    if (node.left) {
        const lineLeft = document.createElementNS(svgNS, "line");
        lineLeft.setAttribute("x1", x);
        lineLeft.setAttribute("y1", y + 30);
        lineLeft.setAttribute("x2", x - dx);
        lineLeft.setAttribute("y2", y + dy);
        lineLeft.setAttribute("stroke", "#555");
        lineLeft.setAttribute("stroke-width", 2);
        svg.appendChild(lineLeft);

        dibujarGrafo(svg, node.left, x - dx, y + dy, dx / 2, dy);
    }

    if (node.right) {
        const lineRight = document.createElementNS(svgNS, "line");
        lineRight.setAttribute("x1", x);
        lineRight.setAttribute("y1", y + 30);
        lineRight.setAttribute("x2", x + dx);
        lineRight.setAttribute("y2", y + dy);
        lineRight.setAttribute("stroke", "#555");
        lineRight.setAttribute("stroke-width", 2);
        svg.appendChild(lineRight);

        dibujarGrafo(svg, node.right, x + dx, y + dy, dx / 2, dy);
    }
};
