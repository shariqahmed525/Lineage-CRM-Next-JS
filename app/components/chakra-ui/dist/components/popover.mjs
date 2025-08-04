import { popoverAnatomy } from '@chakra-ui/anatomy';
import { createMultiStyleConfigHelpers, defineStyle } from '@chakra-ui/styled-system';

const { defineMultiStyleConfig, definePartsStyle } = createMultiStyleConfigHelpers(popoverAnatomy.keys);
const baseStyleContent = defineStyle({
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

export { popover as default };
