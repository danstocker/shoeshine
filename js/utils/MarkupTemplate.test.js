/*global dessert, troop, sntls, shoeshine */
/*global module, test, expect, ok, equal, strictEqual, notStrictEqual, deepEqual, notDeepEqual, raises */
(function () {
    "use strict";

    module("MarkupTemplate", {
        setup: function () {
            shoeshine.MarkupTemplate.clearInstanceRegistry();
        },

        teardown: function () {
            shoeshine.MarkupTemplate.clearInstanceRegistry();
        }
    });

    test("Instantiation", function () {
        var markup = [
                //@formatter:off
                '<foo class="hello ">',
                    '<bar class="   hi world    ">     ',
                        'hello',
                        '   {{xxx}} ',
                    '</bar> ',
                '</foo> '
                //@formatter:on
            ].join(''),
            template = shoeshine.MarkupTemplate.create(markup);

//        console.log(template.templateString);
//        console.log(JSON.stringify(template.preprocessedTemplate.items, null, 2));
//        console.log(JSON.stringify(template.placeholderLookup.items, null, 2));

        equal(template.templateString, markup, "should set template string");

        deepEqual(template.preprocessedTemplate.items, [
            "<foo class=\"hello \">",
            "",
            "<bar class=\"   hi world    \">     hello   ",
            "{{xxx}}",
            "",
            " ",
            "</bar>",
            " ",
            "</foo> "
        ], "should set preprocessed template contents");

        deepEqual(template.placeholderLookup.items, {
            "hello": 0,
            "null" : 1,
            "hi"   : 2,
            "world": 2,
            "xxx"  : 3
        }, "should set placeholderLookup contents");

        strictEqual(shoeshine.MarkupTemplate.create(markup), template, "should be memoized");
    });

    test("Conversion from string", function () {
        var template = 'foo bar'.toMarkupTemplate();

        ok(template.isA(shoeshine.MarkupTemplate), "should return a MarkupTemplate instance");
        equal(template.templateString, "foo bar", "should set template string");
    });

    test("Conversion from string to placeholder", function () {
        equal('foo'.toPlaceholder(), '{{foo}}', "should envelope placeholder in handlebars");
    });

    test("Filling single placeholder", function () {
        var template = "{{foo}} {{bar}}".toMarkupTemplate();
        equal(template.fillPlaceholder('foo', "Hello"), "Hello {{bar}}", "should fill in specified placeholder only");
    });

    test("Filling multiple placeholders", function () {
        var template = "{{foo}} {{bar}}".toMarkupTemplate();

        equal(
            template.fillPlaceholders({
                foo: "Hello",
                bar: "World"
            }),
            "Hello World",
            "should fill in all provided placeholders");

        equal(
            template.fillPlaceholders({
                foo: "Hello"
            }),
            "Hello {{bar}}",
            "should preserve placeholders not specified");

        equal(
            template.fillPlaceholders({
                foo: "Hello",
                bar: {}
            }),
            "Hello [object Object]",
            "should stringify object fill values");
    });

    test("Filling containers", function () {
        var markup = [
                //@formatter:off
                '<foo class="hello">',
                    '<bar class="hi world">',
                        'hello',
                        '{{xxx}}',
                    '</bar>',
                '</foo>'
                //@formatter:on
            ].join(''),
            template = markup.toMarkupTemplate();

        equal(
            template.fillPlaceholders({
                hi   : "<baz />",
                world: '<span>Hello!</span>',
                xxx  : "World"
            }),
            '<foo class="hello"><bar class="hi world">hello<baz /><span>Hello!</span>World</bar></foo>',
            "should inject content into container as well as replace placeholder");
    });

    test("Filling empty template", function () {
        var template = ''.toMarkupTemplate();

        equal(
            template.fillPlaceholders({
                foo: "Hello",
                bar: "World"
            }),
            "",
            "should return empty string");
    });


    test("Clearing placeholders", function () {
        var template = "{{foo}}baz{{bar}}".toMarkupTemplate();
        equal(template.clearPlaceholders(), 'baz', "should remove all placeholders");
    });
}());