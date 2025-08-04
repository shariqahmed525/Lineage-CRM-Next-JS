'use strict';

Object.defineProperties(exports, { __esModule: { value: true }, [Symbol.toStringTag]: { value: 'Module' } });

const anatomy = require('@chakra-ui/anatomy');
const styledSystem = require('@chakra-ui/styled-system');

const { defineMultiStyleConfig, definePartsStyle } = styledSystem.createMultiStyleConfigHelpers(anatomy.popoverAnatomy.keys);
const baseStyleContent = styledSystem.defineStyle({
  bg: "bg.surface",
  borderWidth: "1px",
  boxShadow: "lg",
  borderRadius: "lg",
  overflow: "hidden",
  _focusVisible: {
    boxShadow: "focus"
  }
});
const baseStyle = definePartsStyle({
  content: baseStyleContent
});
const popover = defineMultiStyleConfig({
  baseStyle
});

exports.default = popover;
