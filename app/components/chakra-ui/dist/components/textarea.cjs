'use strict';

Object.defineProperties(exports, { __esModule: { value: true }, [Symbol.toStringTag]: { value: 'Module' } });

const themeTools = require('@chakra-ui/theme-tools');

const variants = {
  outline: (props) => ({
    borderRadius: "lg",
    bg: themeTools.mode("white", "gray.800")(props),
    _hover: { borderColor: themeTools.mode("gray.300", "gray.600")(props) },
    _focus: {
      borderColor: themeTools.mode("brand.500", "brand.200")(props),
      boxShadow: themeTools.mode(
        `0px 0px 0px 1px ${themeTools.transparentize(`brand.500`, 1)(props.theme)}`,
        `0px 0px 0px 1px ${themeTools.transparentize(`brand.200`, 1)(props.theme)}`
      )(props)
    }
  })
};
const textarea = {
  variants
};

exports.default = textarea;
