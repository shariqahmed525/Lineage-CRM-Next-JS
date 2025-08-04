import { SystemStyleInterpolation } from '@chakra-ui/styled-system';
declare const _default: {
    baseStyle?: {
        [x: string]: string | string[] | {
            [x: string]: string;
            _dark?: undefined;
            boxShadow?: undefined;
        } | {
            [x: string]: string | {
                [x: string]: string;
            };
            _dark: {
                [x: string]: string;
            };
            boxShadow?: undefined;
        } | {
            boxShadow: string;
            _dark?: undefined;
        };
        borderRadius: string;
        w: string[];
        h: string[];
        bg: string;
        color: string;
        _dark: {
            [x: string]: string;
        };
        _hover: {
            [x: string]: string | {
                [x: string]: string;
            };
            _dark: {
                [x: string]: string;
            };
        };
        _active: {
            [x: string]: string | {
                [x: string]: string;
            };
            _dark: {
                [x: string]: string;
            };
        };
        _focusVisible: {
            boxShadow: string;
        };
    } | undefined;
    sizes?: {
        '2xs': {
            [x: string]: string;
            fontSize: string;
        };
        xs: {
            [x: string]: string;
            fontSize: string;
        };
        sm: {
            [x: string]: string;
            fontSize: string;
        };
        md: {
            [x: string]: string;
            fontSize: string;
        };
        lg: {
            [x: string]: string;
            fontSize: string;
        };
        xl: {
            [x: string]: string;
            fontSize: string;
        };
        '2xl': {
            [x: string]: string;
            fontSize: string;
        };
    } | undefined;
    variants?: {
        [key: string]: SystemStyleInterpolation;
    } | undefined;
    defaultProps?: {
        size?: "sm" | "md" | "lg" | "xl" | "2xl" | "2xs" | "xs" | undefined;
        variant?: string | number | undefined;
        colorScheme?: string | undefined;
    } | undefined;
};
export default _default;
