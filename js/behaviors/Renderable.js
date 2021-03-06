/*global dessert, troop, sntls, shoeshine */
troop.postpone(shoeshine, 'Renderable', function () {
    "use strict";

    var base = troop.Base,
        self = base.extend();

    /**
     * The Renderable trait allows the host class to be rendered into the DOM.
     * Adds managed HTML attributes, markup, and rendering methods.
     * @class
     * @extends troop.Base
     */
    shoeshine.Renderable = self
        .addPublic(/** @lends shoeshine.Renderable */{
            /**
             * @type {shoeshine.MarkupTemplate}
             */
            contentTemplate: undefined
        })
        .addPrivateMethods(/** @lends shoeshine.Renderable# */{
            /**
             * Proxy for document.createElement.
             * @param {string} tagName
             * @returns {HTMLElement}
             * @private
             */
            _createElementProxy: function (tagName) {
                return document && document.createElement(tagName);
            },

            /**
             * Proxy for fetching DOM element by its ID.
             * @param {string} elementId
             * @returns {HTMLElement}
             * @private
             */
            _getElementByIdProxy: function (elementId) {
                return document && document.getElementById(elementId);
            },

            /**
             * Proxy for setting an attribute on a DOM element.
             * @param {HTMLElement} element
             * @param {string} attributeName
             * @param {string} attributeValue
             * @private
             */
            _attributeSetterProxy: function (element, attributeName, attributeValue) {
                element.setAttribute(attributeName, attributeValue);
            },

            /**
             * Proxy for setting a DOM element's inner HTML.
             * @param {HTMLElement} element
             * @param {string} innerHtml
             * @private
             */
            _innerHtmlSetterProxy: function (element, innerHtml) {
                element.innerHTML = innerHtml;
            },

            /**
             * Proxy for appending child DOM element to parent.
             * @param {HTMLElement} parentElement
             * @param {HTMLElement} childElement
             * @private
             */
            _appendChildProxy: function (parentElement, childElement) {
                parentElement.appendChild(childElement);
            },

            /**
             * Proxy for inserting DOM element before another one.
             * @param {HTMLElement} parentElement
             * @param {HTMLElement} afterElement
             * @param {HTMLElement} element
             * @private
             */
            _insertBeforeProxy: function (parentElement, afterElement, element) {
                parentElement.insertBefore(element, afterElement);
            },

            /**
             * Proxy for replacing a DOM element with a different one.
             * @param {HTMLElement} parentElement
             * @param {HTMLElement} afterElement
             * @param {HTMLElement} beforeElement
             * @private
             */
            _replaceChildProxy: function (parentElement, afterElement, beforeElement) {
                parentElement.replaceChild(afterElement, beforeElement);
            },

            /**
             * Proxy for setting attribute on DOM element.
             * @param {HTMLElement} element
             * @param {string} attributeName
             * @param {string} attributeValue
             * @private
             */
            _setAttributeProxy: function (element, attributeName, attributeValue) {
                element.setAttribute(attributeName, attributeValue);
            },

            /**
             * Proxy for removing attribute from DOM element.
             * @param {HTMLElement} element
             * @param {string} attributeName
             * @private
             */
            _removeAttributeProxy: function (element, attributeName) {
                element.removeAttribute(attributeName);
            },

            /**
             * Proxy for setting style attribute of a DOM element.
             * @param {HTMLElement} element
             * @param {string} styleAttribute
             * @private
             */
            _setStyleProxy: function (element, styleAttribute) {
                element.style.cssText = styleAttribute;
            }
        })
        .addMethods(/** @lends shoeshine.Renderable# */{
            /**
             * Call from host's .init.
             * @param {shoeshine.HtmlAttributes} htmlAttributes
             */
            init: function (htmlAttributes) {
                /**
                 * @type {string}
                 */
                this.tagName = 'div';

                /**
                 * @type {shoeshine.HtmlAttributes}
                 */
                this.htmlAttributes = htmlAttributes || shoeshine.HtmlAttributes.create();
            },

            /**
             * Sets tag name property.
             * @param {string} tagName
             * @returns {shoeshine.Renderable}
             */
            setTagName: function (tagName) {
                dessert.isString(tagName, "Invalid tag name");
                this.tagName = tagName;
                return this;
            },

            /**
             * Adds CSS class to the instance, modifying both buffer and DOM element.
             * @param {string} cssClass
             * @returns {shoeshine.Renderable}
             */
            addCssClass: function (cssClass) {
                var htmlAttributes = this.htmlAttributes,
                    element = this.getElement();

                htmlAttributes.addCssClass(cssClass);

                if (element) {
                    this._setAttributeProxy(element, 'class', htmlAttributes.cssClasses.toString());
                }

                return this;
            },

            /**
             * Decreases ref count of CSS class on the instance, modifying both buffer and DOM element.
             * @param {string} cssClass
             * @returns {shoeshine.Renderable}
             */
            decreaseCssClassRefCount: function (cssClass) {
                var htmlAttributes = this.htmlAttributes,
                    element = this.getElement();

                htmlAttributes.decreaseCssClassRefCount(cssClass);

                if (element) {
                    this._setAttributeProxy(element, 'class', htmlAttributes.cssClasses.toString());
                }

                return this;
            },

            /**
             * Removes a CSS class from the instance, modifying both buffer and DOM element.
             * @param {string} cssClass
             * @returns {shoeshine.Renderable}
             */
            removeCssClass: function (cssClass) {
                var htmlAttributes = this.htmlAttributes,
                    element = this.getElement();

                htmlAttributes.removeCssClass(cssClass);

                if (element) {
                    this._setAttributeProxy(element, 'class', htmlAttributes.cssClasses.toString());
                }

                return this;
            },

            /**
             * Tells whether the current instance has the specified CSS class.
             * @param {string} cssClass
             * @returns {boolean}
             */
            hasCssClass: function (cssClass) {
                return !!this.htmlAttributes.cssClasses.getItem(cssClass);
            },

            /**
             * Sets inline style on instance, modifying both buffer and DOM element.
             * @param {string} styleName
             * @param {string} [styleValue]
             * @returns {shoeshine.Renderable}
             */
            setInlineStyle: function (styleName, styleValue) {
                var htmlAttributes = this.htmlAttributes,
                    element = this.getElement();

                if (typeof styleValue === 'undefined') {
                    htmlAttributes.removeInlineStyle(styleName);
                } else {
                    htmlAttributes.addInlineStyle(styleName, styleValue);
                }

                if (element) {
                    this._setStyleProxy(element, htmlAttributes.inlineStyles.toString());
                }

                return this;
            },

            /**
             * Adds attribute to instance, modifying both buffer and DOM element.
             * TODO: Handle 'id' and 'class' attributes.
             * @param {string} attributeName
             * @param {string} attributeValue
             * @returns {shoeshine.Renderable}
             */
            addAttribute: function (attributeName, attributeValue) {
                this.htmlAttributes.setItem(attributeName, attributeValue);

                var element = this.getElement();
                if (element) {
                    this._setAttributeProxy(element, attributeName, attributeValue);
                }

                return this;
            },

            /**
             * Removes attribute from instance, modifying both buffer and DOM element.
             * @param {string} attributeName Name of the HTML attribute to remove. Values 'class' and 'style' also
             * clear the corresponding collections. Use carefully!
             * @returns {shoeshine.Renderable}
             */
            removeAttribute: function (attributeName) {
                this.htmlAttributes.deleteItem(attributeName);

                var element = this.getElement();
                if (element) {
                    this._removeAttributeProxy(element, attributeName);
                }

                return this;
            },

            /**
             * Creates a new DOM element based on the current state of the instance.
             * Has no effect if the instance already has an element in the DOM associated with it.
             * TODO: Remove template conversion & placeholder clearing.
             * @returns {HTMLElement}
             */
            createElement: function () {
                var element = this._createElementProxy(this.tagName),
                    attributeSetterProxy = this._attributeSetterProxy,
                    innerHtml = this.contentMarkup()
                        .toHandlebarsTemplate()
                        .clearPlaceholders();

                // adding attributes to element
                this.htmlAttributes
                    .getFinalAttributes()
                    .forEachItem(function (attributeValue, attributeName) {
                        attributeSetterProxy(element, attributeName, attributeValue);
                    });

                // adding contents to element
                this._innerHtmlSetterProxy(element, innerHtml);

                return element;
            },

            /**
             * Fetches element from DOM associated with current instance.
             * @returns {HTMLElement}
             */
            getElement: function () {
                return this._getElementByIdProxy(this.htmlAttributes.idAttribute);
            },

            /**
             * Renders instance into the specified element by appending it to it.
             * Moves existing element to new location by default. Override by forcing rendering.
             * @param {HTMLElement} parentElement
             * @param {boolean} [force]
             * @returns {shoeshine.Renderable}
             */
            renderInto: function (parentElement, force) {
                var element = (!force && this.getElement()) || this.createElement();
                this._appendChildProxy(parentElement, element);
                return this;
            },

            /**
             * Renders instance before the specified element.
             * Moves existing element to new location by default. Override by forcing rendering.
             * @param {HTMLElement} adjacentElement
             * @param {boolean} [force]
             * @returns {shoeshine.Renderable}
             */
            renderBefore: function (adjacentElement, force) {
                var parentElement = adjacentElement.parentNode,
                    element = (!force && this.getElement()) || this.createElement();

                this._insertBeforeProxy(parentElement, adjacentElement, element);

                return this;
            },

            /**
             * Re-renders instance by replacing the current DOM element with a new one.
             * Has no effect when instance has never been rendered.
             * External references to the instance's DOM must be invalidated afterwards.
             * @returns {shoeshine.Renderable}
             */
            reRender: function () {
                var element = this.getElement();
                if (element) {
                    this._replaceChildProxy(element.parentNode, this.createElement(), element);
                }
                return this;
            },

            /**
             * Re-renders the contents of the instance, leaving its main DOM element unchanged.
             * Has no effect when instance has never been rendered.
             * External references to the instance's internal DOM must be invalidated afterwards.
             * TODO: Remove template conversion & placeholder clearing.
             * @returns {shoeshine.Renderable}
             */
            reRenderContents: function () {
                var element = this.getElement(),
                    innerHtml;

                if (element) {
                    // generating current markup
                    innerHtml = this.contentMarkup()
                        .toHandlebarsTemplate()
                        .clearPlaceholders();

                    // adding contents to element
                    this._innerHtmlSetterProxy(element, innerHtml);
                }

                return this;
            },

            /**
             * Retrieves the widget's markup as a MarkupTemplate instance.
             * @returns {shoeshine.MarkupTemplate}
             */
            contentMarkupAsTemplate: function () {
                return this.contentTemplate.clone();
            },

            /**
             * Override method defining the contents of the Renderable instance.
             * @returns {string}
             */
            contentMarkup: function () {
                return this.contentTemplate ?
                    this.contentMarkupAsTemplate().toString():
                    '';
            },

            /**
             * Generates full markup for the current instance.
             * TODO: Remove template conversion & placeholder clearing.
             * @returns {string}
             */
            toString: function () {
                var tagName = this.tagName;
                return [
                    '<' + tagName + ' ' + this.htmlAttributes + '>',
                    this.contentMarkup()
                        .toHandlebarsTemplate()
                        .clearPlaceholders(),
                    '</' + tagName + '>'
                ].join('');
            }
        });
});
