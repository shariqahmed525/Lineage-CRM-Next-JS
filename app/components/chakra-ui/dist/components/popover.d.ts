import { PartsStyleInterpolation } from '@chakra-ui/styled-system';
declare const _default: {
    baseStyle?: {
        content: {
            bg: string;
            borderWidth: string;
            boxShadow: string;
            borderRadius: string;
            overflow: string;
            _focusVisible: {
                boxShadow: string;
            };
        };
    } | undefined;
    sizes?: {
        [key: string]: PartsStyleInterpolation<{
            keys: ("content" | "body" | "header" | "closeButton" | "footer" | "popper" | "arrow")[];
        }>;
    } | undefined;
    variants?: {
        [key: string]: PartsStyleInterpolation<{
            keys: ("content" | "body" | "header" | "closeButton" | "footer" | "popper" | "arrow")[];
        }>;
    } | undefined;
    defaultProps?: {
        size?: string | number | undefined;
        variant?: string | number | undefined;
        colorScheme?: string | undefined;
    } | undefined;
    parts: ("content" | "body" | "header" | "closeButton" | "footer" | "popper" | "arrow")[];
};
export default _default;
