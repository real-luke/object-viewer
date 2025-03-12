// ObjectViewer: A utility to view JavaScript objects in a tree structure.
// Usage: ObjectViewer.view(container, data)
// where container is a DOM element to append the tree to, and data is the object to view.

const ObjectViewer = {
    view: function(container, data) {
        const names = Object.getOwnPropertyNames(data);
        const symbs = Object.getOwnPropertySymbols(data);
        const proto = Object.getPrototypeOf(data);

        const keys = names.sort().concat(symbs);
        const printData = [];

        keys.forEach((key) => {
            const descriptor = Object.getOwnPropertyDescriptor(data, key);
            let { enumerable, value, get, set } = descriptor;

            if (value === undefined) {
                try { value = data[key]; } 
                catch (e) { value = e.message; }
            }

            if (typeof key === "symbol") {
                key = key.toString();
            }

            printData.push({ 
                key: key,
                value: value,
                enumerable: enumerable
            });

            if (get) printData.push({ 
                key: "get " + key, 
                value: get,
                enumerable: enumerable
            });

            if (set) printData.push({ 
                key: "set " + key, 
                value: set,
                enumerable: enumerable
            });
        });

        if (proto) printData.push({
            key: "[[Prototype]]", 
            value: proto,
            enumerable: false
        });

        this.printer(container, printData);
    },

    printer: function(container, printData) {
        const isenum = [];
        const noenum = [];
        const fragment = document.createDocumentFragment();

        printData.forEach((data) => {
            const { key, value, enumerable } = data;
            const label = this.formatter(key, value, enumerable);

            if (this.isPrimitive(value)) {
                const child = this.html("div", {
                    className: "tree-child",
                    innerHTML: label,
                });
                return enumerable ? isenum.push(child) : noenum.push(child);
            }

            const head = this.html("summary", {
                className: "tree-head",
                innerHTML: label,
            });

            const body = this.html("div", {
                className: "tree-body",
            });

            const root = this.html("details", {
                className: "tree",
            }, head, body);

            let visited = false;

            head.onclick = () => {
                if (visited) return;
                this.view(body, value);
                visited = true;
            };

            enumerable ? isenum.push(root) : noenum.push(root);
        });

        fragment.append(...isenum, ...noenum);
        container.append(fragment);
    },

    formatter: function(key, value, enumerable) {
        let type = typeof value;
        let displayValue = value;

        if (value === null) {
            displayValue = "null";
        } else if (type === "string") {
            displayValue = `"${value}"`;
        } else if (type === "function") {
            displayValue = `<span>ƒ</span> ${value.name || "anonymous"}()`;
        } else if (type === "object") {
            let typeName = Array.isArray(value) ? "Array" : (value.constructor && value.constructor.name) || "Object";
            displayValue = `${typeName} ${Array.isArray(value) ? "[...]" : "{...}"}`;
        }

        return `
            <span class="label-key ${enumerable ? "" : "noenum"}">${key}</span>: 
            <span class="label-value ${type}">${displayValue}</span>
        `;
    },

    isPrimitive: function(data) {
        return (typeof data !== "object" && typeof data !== "function") || data === null;
    },

    html: function(name, props, ...childs) {
        const elem = document.createElement(name);

        if (props) {
            for (const key in props) {
                elem[key] = props[key];
            }
        }

        if (childs) {
            elem.append(...childs);
        }

        return elem;
    }
};

window.ObjectViewer = ObjectViewer;
