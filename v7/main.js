class Component {
    constructor(props) {
        this.props = props;
    }

    nest(...args) {
        this.nestedChildren = this.parse(...args);
        return this;
    }

    element(callback) {
        this.onElementCallback = callback;
        return this;
    }

    parse(/** @type{string[]} */strings, /** @type{Component[]} */...args) {
        let result = strings[0];
        for (let i = 0; i < strings.length - 1; i++) {
            result += `<div class="placeholder-${i}"></div>`;
            result += strings[i + 1];
        }
    
        let temp = document.createElement('div');
        temp.innerHTML = result;
    
    
    
        for (let i = 0; i < args.length; i++) {
            const placeholderNote = temp.getElementsByClassName(`placeholder-${i}`)[0];
            placeholderNote.parentNode.replaceChild(args[i].asElement(), placeholderNote);
        }
    
        let fragmentHanlde = document.createDocumentFragment();

        while (temp.childNodes.length > 0) {
            fragmentHanlde.appendChild(temp.childNodes[0]);
        }
    
        temp = null; // memory clean up
    
        return fragmentHanlde;
    }

    render() {
        // API Hook
        throw new Error('getElement API hook must be implemented');
    }

    asElement() {
        const element = this.render();
        if (this.onElementCallback) {
            this.onElementCallback(element);
        }
        return /** @type{HTMLElement} */(element);
    }
}

class MySubmitButton extends Component {
    render() {
        let element = document.createElement('button')
        element.addEventListener('click', this.props.onClick);
        if (this.nestedChildren) {
            element.appendChild(this.nestedChildren);
        }
        return element;
    }
}

class MyForm extends Component {
    render() {
        let element = document.createElement('form')
        element.appendChild(this.nestedChildren);
        return element;
    }
}

class App extends Component {
    constructor() {
        super();
        let element = this.parse`
        <main>
        ${new MyForm().nest`
            <label>name <input type="text"></label>
            <label>address <input type="text"></label>
            ${new MySubmitButton({onClick: e => this.handleClick(event)}).nest`hello world`}
        `.element(element => this.formElementRef = element)}
        </main>`;

        document.getElementById('app-root').appendChild(element);
    }

    handleClick(/** @type{MouseEvent} */event) {
        event.preventDefault();
        console.dir(this.formElementRef);
    }
}


new App();