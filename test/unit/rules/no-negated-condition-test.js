'use strict';

const rule = require('../../../lib/rules/no-negated-condition');
const generateRuleTests = require('../../helpers/rule-test-harness');

const { ERROR_MESSAGE_FLIP_IF, ERROR_MESSAGE_USE_IF, ERROR_MESSAGE_USE_UNLESS } = rule;

generateRuleTests({
  name: 'no-negated-condition',

  config: true,

  good: [
    // ******************************************
    // BlockStatement
    // ******************************************

    // if ...
    '{{#if condition}}<img>{{/if}}',
    '{{#if (or c1 c2)}}{{/if}}',
    '{{#if (not (or c1 c2))}}{{/if}}', // Valid since we don't want to suggest `unless` with helpers in the condition.

    // if ... else ...
    '{{#if condition}}<img>{{else}}<img>{{/if}}',
    '{{#if (or c1 c2)}}<img>{{else}}<img>{{/if}}',

    // if ... else if ...
    '{{#if condition}}<img>{{else if condition}}<img>{{/if}}',
    '{{#if condition}}<img>{{else if (not condition2)}}<img>{{/if}}', // we ignore `if ... else if ...`
    '{{#if (not condition)}}<img>{{else if (not condition2)}}<img>{{/if}}', // we ignore `if ... else if ...`

    // if ... else if ... else ...
    '{{#if condition}}<img>{{else if condition}}<img>{{else}}<img>{{/if}}',
    '{{#if (not condition)}}<img>{{else if (not condition2)}}<img>{{else}}<img>{{/if}}', // we ignore `if ... else if ...`

    // unless ...
    '{{#unless condition}}<img>{{/unless}}',
    '{{#unless (or c1 c2)}}<img>{{/unless}}',

    // unless ... else ...
    '{{#unless condition}}<img>{{else}}<img>{{/unless}}',
    '{{#unless (or c1 c2)}}<img>{{else}}<img>{{/unless}}',

    // unless ... else if ...
    '{{#unless condition}}<img>{{else if condition}}<img>{{/unless}}',
    '{{#unless (or c1 c2)}}<img>{{else if (or c1 c2)}}<img>{{/unless}}',

    // unless ... else if ... else ...
    '{{#unless condition}}<img>{{else if condition}}<img>{{else}}<img>{{/unless}}',
    '{{#unless (or c1 c2)}}<img>{{else if (or c1 c2)}}<img>{{else}}<img>{{/unless}}',

    // ******************************************
    // MustacheStatement
    // ******************************************

    // if ...
    '<img class={{if condition "some-class"}}>',
    '<img class={{if (or c1 c2) "some-class"}}>',
    '<img class={{if (not (or c1 c2)) "some-class"}}>', // Valid since we don't want to suggest `unless` with helpers in the condition.

    // if ... else ...
    '<img class={{if condition "some-class" "other-class"}}>',
    '<img class={{if (or c1 c2) "some-class" "other-class"}}>',

    // unless ...
    '<img class={{unless condition "some-class"}}>',
    '<img class={{unless (or c1 c2) "some-class"}}>',

    // unless ... else ...
    '<img class={{unless condition "some-class" "other-class"}}>',
    '<img class={{unless (or c1 c2) "some-class" "other-class"}}>',

    // ******************************************
    // SubExpression
    // ******************************************

    // if ...
    '{{input class=(if condition "some-class")}}',
    '{{input class=(if (or c1 c2) "some-class")}}',
    '{{input class=(if (not (or c1 c2)) "some-class")}}', // Valid since we don't want to suggest `unless` with helpers in the condition.

    // if ... else ...
    '{{input class=(if condition "some-class" "other-class")}}',
    '{{input class=(if (or c1 c2) "some-class" "other-class")}}',

    // unless ...
    '{{input class=(unless condition "some-class")}}',
    '{{input class=(unless (or c1 c2) "some-class")}}',

    // unless ... else ...
    '{{input class=(unless condition "some-class" "other-class")}}',
    '{{input class=(unless (or c1 c2) "some-class" "other-class")}}',
  ],

  bad: [
    // ******************************************
    // BlockStatement
    // ******************************************

    // if ...
    {
      template: '{{#if (not condition)}}<img>{{/if}}',
      fixedTemplate: '{{#unless condition}}<img>{{/unless}}',

      result: {
        message: ERROR_MESSAGE_USE_UNLESS,
        source: '{{#if (not condition)}}<img>{{/if}}',
        line: 1,
        column: 0,
        isFixable: true,
      },
    },

    // if ... else ...
    {
      template: '{{#if (not condition)}}<img>{{else}}<input>{{/if}}',
      fixedTemplate: '{{#if condition}}<input>{{else}}<img>{{/if}}',

      result: {
        message: ERROR_MESSAGE_FLIP_IF,
        source: '{{#if (not condition)}}<img>{{else}}<input>{{/if}}',
        line: 1,
        column: 0,
        isFixable: true,
      },
    },

    // unless ...
    {
      template: '{{#unless (not condition)}}<img>{{/unless}}',
      fixedTemplate: '{{#if condition}}<img>{{/if}}',

      result: {
        message: ERROR_MESSAGE_USE_IF,
        source: '{{#unless (not condition)}}<img>{{/unless}}',
        line: 1,
        column: 0,
        isFixable: true,
      },
    },

    // unless ... else ...
    {
      template: '{{#unless (not condition)}}<img>{{else}}<input>{{/unless}}',
      fixedTemplate: '{{#if condition}}<img>{{else}}<input>{{/if}}',

      result: {
        message: ERROR_MESSAGE_USE_IF,
        source: '{{#unless (not condition)}}<img>{{else}}<input>{{/unless}}',
        line: 1,
        column: 0,
        isFixable: true,
      },
    },

    // unless ... else if ...
    {
      template: '{{#unless (not condition)}}<img>{{else if (not condition)}}<input>{{/unless}}',
      fixedTemplate: '{{#if condition}}<img>{{else if (not condition)}}<input>{{/if}}',

      result: {
        message: ERROR_MESSAGE_USE_IF,
        source: '{{#unless (not condition)}}<img>{{else if (not condition)}}<input>{{/unless}}',
        line: 1,
        column: 0,
        isFixable: true,
      },
    },

    // unless ... else if ... else ...
    {
      template:
        '{{#unless (not condition)}}<img>{{else if (not condition)}}<input>{{else}}<hr>{{/unless}}',
      fixedTemplate: '{{#if condition}}<img>{{else if (not condition)}}<input>{{else}}<hr>{{/if}}',

      result: {
        message: ERROR_MESSAGE_USE_IF,
        source:
          '{{#unless (not condition)}}<img>{{else if (not condition)}}<input>{{else}}<hr>{{/unless}}',
        line: 1,
        column: 0,
        isFixable: true,
      },
    },

    // Nested inside the body of an `else` block (with preceding comment):
    {
      template:
        '{{#if condition}}{{else}}{{! some comment }}{{#if (not condition)}}<img>{{/if}}{{/if}}',
      fixedTemplate:
        '{{#if condition}}{{else}}{{! some comment }}{{#unless condition}}<img>{{/unless}}{{/if}}',

      result: {
        message: ERROR_MESSAGE_USE_UNLESS,
        source: '{{#if (not condition)}}<img>{{/if}}',
        line: 1,
        column: 44,
        isFixable: true,
      },
    },

    // Nested inside the body of an `else` block (without preceding comment):
    {
      template: '{{#if condition}}{{else}}{{#if (not condition)}}<img>{{/if}}{{/if}}',
      fixedTemplate: '{{#if condition}}{{else}}{{#unless condition}}<img>{{/unless}}{{/if}}',

      result: {
        message: ERROR_MESSAGE_USE_UNLESS,
        source: '{{#if (not condition)}}<img>{{/if}}',
        line: 1,
        column: 25,
        isFixable: true,
      },
    },

    // ******************************************
    // MustacheStatement
    // ******************************************

    // if ...
    {
      template: '<img class={{if (not condition) "some-class"}}>',
      fixedTemplate: '<img class={{unless condition "some-class"}}>',

      result: {
        message: ERROR_MESSAGE_USE_UNLESS,
        source: '{{if (not condition) "some-class"}}',
        line: 1,
        column: 11,
        isFixable: true,
      },
    },

    // if ... else ...
    {
      template: '<img class={{if (not condition) "some-class" "other-class"}}>',
      fixedTemplate: '<img class={{if condition "other-class" "some-class"}}>',

      result: {
        message: ERROR_MESSAGE_FLIP_IF,
        source: '{{if (not condition) "some-class" "other-class"}}',
        line: 1,
        column: 11,
        isFixable: true,
      },
    },

    // unless ...
    {
      template: '<img class={{unless (not condition) "some-class"}}>',
      fixedTemplate: '<img class={{if condition "some-class"}}>',

      result: {
        message: ERROR_MESSAGE_USE_IF,
        source: '{{unless (not condition) "some-class"}}',
        line: 1,
        column: 11,
        isFixable: true,
      },
    },

    // unless ... else ...
    {
      template: '<img class={{unless (not condition) "some-class" "other-class"}}>',
      fixedTemplate: '<img class={{if condition "some-class" "other-class"}}>',

      result: {
        message: ERROR_MESSAGE_USE_IF,
        source: '{{unless (not condition) "some-class" "other-class"}}',
        line: 1,
        column: 11,
        isFixable: true,
      },
    },

    // ******************************************
    // SubExpression
    // ******************************************

    // if ...
    {
      template: '{{input class=(if (not condition) "some-class")}}',
      fixedTemplate: '{{input class=(unless condition "some-class")}}',

      result: {
        message: ERROR_MESSAGE_USE_UNLESS,
        source: '(if (not condition) "some-class")',
        line: 1,
        column: 14,
        isFixable: true,
      },
    },

    // if ... else ...
    {
      template: '{{input class=(if (not condition) "some-class" "other-class")}}',
      fixedTemplate: '{{input class=(if condition "other-class" "some-class")}}',

      result: {
        message: ERROR_MESSAGE_FLIP_IF,
        source: '(if (not condition) "some-class" "other-class")',
        line: 1,
        column: 14,
        isFixable: true,
      },
    },

    // unless ...
    {
      template: '{{input class=(unless (not condition) "some-class")}}',
      fixedTemplate: '{{input class=(if condition "some-class")}}',

      result: {
        message: ERROR_MESSAGE_USE_IF,
        source: '(unless (not condition) "some-class")',
        line: 1,
        column: 14,
        isFixable: true,
      },
    },

    // unless ... else ...
    {
      template: '{{input class=(unless (not condition) "some-class" "other-class")}}',
      fixedTemplate: '{{input class=(if condition "some-class" "other-class")}}',

      result: {
        message: ERROR_MESSAGE_USE_IF,
        source: '(unless (not condition) "some-class" "other-class")',
        line: 1,
        column: 14,
        isFixable: true,
      },
    },
  ],
});
