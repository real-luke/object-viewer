// ObjectViewer: A utility to view JavaScript objects in a tree structure.
// Usage: ObjectViewer.view(data, container)
// where data is the object to view, and container is a DOM element to append the tree to.

const ObjectViewer = {
    view(data, container) {
        container.innerHTML = "";
        if (this.isPrimitive(data)) {
            const label = this.formatter("", data, true);
            container.append(this.createPrimitiveElement(label));
            return;
        }
        this.processObject(container, data);
    },

    processObject(container, data) {
        const printData = [];
        const proto = Object.getPrototypeOf(data);
        
        const properties = [
            ...Object.getOwnPropertyNames(data).sort(),
            ...Object.getOwnPropertySymbols(data)
        ];

        properties.forEach(key => {
            const desc = Object.getOwnPropertyDescriptor(data, key);
            if (this.isDefaultAccessor(key, desc)) return;
            this.processDescriptor(printData, data, key, desc);
        });

        if (proto !== null && proto !== Object.prototype) {
            printData.push({ 
                key: "[[Prototype]]", 
                value: proto, 
                enumerable: false 
            });
        }

        this.createDOMTree(container, printData);
    },

    isDefaultAccessor(key, desc) {
        try {
            const protoDesc = Object.getOwnPropertyDescriptor(Object.prototype, key);
            if (!protoDesc) return false;
            const isSameGetter = protoDesc.get && desc.get === protoDesc.get;
            const isSameSetter = protoDesc.set && desc.set === protoDesc.set;
            return isSameGetter || isSameSetter;
        } catch {
            return false;
        }
    },

    processDescriptor(printData, data, key, desc) {
        let value, enumerable = desc.enumerable;
        try { 
            value = data[key]; 
        } catch (e) { 
            value = e.message; 
        }
        printData.push({ key, value, enumerable });
    },

    createDOMTree(container, items) {
        const fragment = document.createDocumentFragment();
        items.forEach(({ key, value, enumerable }) => {
            const element = this.isPrimitive(value)
                ? this.createPrimitiveElement(this.formatter(key, value, enumerable))
                : this.createExpandableElement(key, value, enumerable);
            fragment.append(element);
        });
        container.append(fragment);
    },

    createExpandableElement(key, value, enumerable) {
        const details = document.createElement("details");
        details.className = "tree-node";
        details.innerHTML = `
            <summary class="tree-header">
                ${this.formatter(key, value, enumerable)}
            </summary>
            <div class="tree-children"></div>
        `;
        
        let initialized = false;
        details.addEventListener("toggle", () => {
            if (details.open && !initialized) {
                this.view(value, details.querySelector('.tree-children'));
                initialized = true;
            }
        });
        return details;
    },

    createPrimitiveElement(content) {
        const div = document.createElement("div");
        div.className = "tree-node";
        div.innerHTML = `<span class="tree-header">${content}</span>`;
        return div;
    },

    formatter(key, value, enumerable) {
        let type = typeof value;
        let display = "";
        const typePill = `<span class="type-pill">${type}</span>`;

        if (value === undefined) {
            display = "undefined";
            type = "undefined";
        } else if (value === null) {
            display = "null";
            type = "null";
        } else if (type === "string") {
            display = `"${value}"`;
        } else if (type === "function") {
            display = `<span class="icon">ƒ</span> ${value.name || "anonymous"}()`;
        } else if (this.isDate(value)) {
            display = this.safeDateString(value);
        } else if (this.isRegExp(value)) {
            display = this.safeRegExpString(value);
        } else if (Array.isArray(value)) {
            display = `Array[${value.length}]`;
            type = "object";
        } else if (type === "object") {
            display = this.getObjectTypeName(value);
        } else {
            display = value;
        }

        return `
            <span class="label-key ${enumerable ? "" : "noenum"}">${this.safeKeyToString(key)}</span>
            ${key ? ":" : ""}
            <span class="label-value ${type}">${display}</span>
            ${typePill}
        `;
    },

    safeKeyToString(key) {
        try {
            return key.toString();
        } catch (e) {
            return "[UnsafeKey]";
        }
    },

    isDate(value) {
        try {
            return value instanceof Date;
        } catch (e) {
            return false;
        }
    },

    isRegExp(value) {
        try {
            return value instanceof RegExp;
        } catch (e) {
            return false;
        }
    },

    safeDateString(value) {
        try {
            return value.toISOString();
        } catch (e) {
            return "Invalid Date";
        }
    },

    safeRegExpString(value) {
        try {
            return value.toString();
        } catch (e) {
            return "/invalid_regex/";
        }
    },

    getObjectTypeName(value) {
        try {
            if (typeof value !== "object" || value === null) return "Object";

            const constructor = Object.prototype.toString.call(value).slice(8, -1);
            return constructor === "Object" ? 
                (value.constructor?.name || "Object") : 
                constructor;
        } catch (e) {
            return "Object";
        }
    },
    
    isPrimitive(value) {
        return (
            value === null ||
            value === undefined ||
            (typeof value !== "object" && typeof value !== "function") ||
            (value instanceof Date) ||
            (value instanceof RegExp)
        );
    }
};

window.ObjectViewer = ObjectViewer;
