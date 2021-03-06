/**
 * @fileoverview Ensures consistent parameter names in blaze event maps
 * @author Philipp Sporrer, Dominik Ferber
 * @copyright 2016 Philipp Sporrer. All rights reserved.
 * See LICENSE file in root directory for full license.
 */

import { isFunction, isTemplateProp } from '../util/ast'

// -----------------------------------------------------------------------------
// Rule Definition
// -----------------------------------------------------------------------------

export default context => {
  // ---------------------------------------------------------------------------
  // Helpers
  // ---------------------------------------------------------------------------

  function ensureParamName(param, expectedParamName) {
    if (param && param.name !== expectedParamName) {
      context.report(
        param,
        `Invalid parameter name, use "${expectedParamName}" instead`
      )
    }
  }

  function validateEventDefinition(node) {
    const eventHandler = node.value
    if (isFunction(eventHandler.type)) {
      const {
        eventParamName = 'event',
        templateInstanceParamName = 'templateInstance',
      } = context.options[0] || {}

      ensureParamName(eventHandler.params[0], eventParamName)
      ensureParamName(eventHandler.params[1], templateInstanceParamName)
    }
  }

  // ---------------------------------------------------------------------------
  // Public
  // ---------------------------------------------------------------------------

  return {
    CallExpression: (node) => {
      if (node.arguments.length === 0 || !isTemplateProp(node.callee, 'events')) {
        return
      }
      const eventMap = node.arguments[0]

      if (eventMap.type === 'ObjectExpression') {
        eventMap.properties.forEach(validateEventDefinition)
      }
    },
  }
}

export const schema = [
  {
    type: 'object',
    properties: {
      eventParamName: {
        type: 'string',
      },
      templateInstanceParamName: {
        type: 'string',
      },
    },
    additionalProperties: false,
  },
]
