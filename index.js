import REACT from 'react';
import REACT_DOM from 'react-dom';

import React_root_component from './component';
import VALIDATION from './validation';

React_root.prototype = Object.freeze({ render: render_root, go_to });

export default Object.freeze(React_root);

// -----------

function React_root(params) {
    const this_root = this;
    if (!(this_root instanceof React_root)) {
        return new React_root(params);
    }

    this_root.routes = VALIDATION.ensure_valid_routes(params.routes);

    // Is app root?
    // Meaning, does this React root control top-level navigation,
    // like change the url and the title of the document
    this_root.is_app_root = Boolean(params.is_app_root);

    // Props that initialize state (so let the component validate)
    if (!this_root.is_app_root) {
        this_root.url = params.url;
        this_root.path = params.path;
        this_root.query = params.query;
        this_root.fragment = params.fragment;
    }

    return this_root;
}

function go_to(params) {
    const this_root = this;
    const url_params = VALIDATION.ensure_valid_url_params(params);
    this_root.is_app_root
        && window.history.pushState({}, '', url_params.url)
        ; // eslint-disable-line indent
    this_root.page.setState(url_params);
    return true;
}

function on_click_local_hyperlink(click_event) {
    click_event.preventDefault();
    const this_root = this;
    const { pathname, search, hash } = click_event.currentTarget;
    this_root.go_to({ path: pathname, query: search, fragment: hash });
    return true;
}

function render_root(element) {
    const this_root = this;
    const { is_app_root, routes, path, query, fragment } = this_root;
    const dom_element = element instanceof HTMLElement
        ? element
        : document.getElementById(element)
        ;

    const page_react_element = REACT.createElement(React_root_component, {
        dom_element,
        is_app_root,
        routes,
        path,
        query,
        fragment,
        }); // eslint-disable-line
    this_root.page = REACT_DOM.render(page_react_element, dom_element);

    if (is_app_root) {
        const hyperlinks = document.querySelectorAll('a[href]');
        for (let i = 0, n = hyperlinks.length - 1; i <= n; i++) {
            const hyperlink = hyperlinks[i];
            window.location.host === hyperlink.host
                && hyperlink.addEventListener(
                    'click', on_click_local_hyperlink.bind(this_root),
                    ) // eslint-disable-line indent
                ; // eslint-disable-line indent
        }
    }
    return true;
}
