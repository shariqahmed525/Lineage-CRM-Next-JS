import { SystemStyleInterpolation } from '@chakra-ui/styled-system';
declare const _default: {
    baseStyle?: SystemStyleInterpolation | undefined;
    sizes?: {
        [key: string]: SystemStyleInterpolation;
    } | undefined;
    variants?: {
        underline: {
            [x: string]: string | {
                [x: string]: string;
                content?: undefined;
                position?: undefined;
                width?: undefined;
                height?: undefined;
                borderRadius?: undefined;
                backgroundColor?: undefined;
                bottom?: undefined;
                left?: undefined;
                transformOrigin?: undefined;
                transform?: undefined;
                transition?: undefined;
                textDecoration?: undefined;
                _before?: undefined;
            } | {
                content: string;
                position: string;
                width: string;
                height: string;
                borderRadius: string;
                backgroundColor: string;
                bottom: string;
                left: string;
                transformOrigin: string;
                transform: string;
                transition: string;
                textDecoration?: undefined;
                _before?: undefined;
            } | {
                textDecoration: string;
                _before: {
                    transformOrigin: string;
                    transform: string;
                };
                content?: undefined;
                position?: undefined;
                width?: undefined;
                height?: undefined;
                borderRadius?: undefined;
                backgroundColor?: undefined;
                bottom?: undefined;
                left?: undefined;
                transformOrigin?: undefined;
                transform?: undefined;
                transition?: undefined;
            };
            position: string;
            color: string;
            _dark: {
                [x: string]: string;
            };
            _before: {
                content: string;
                position: string;
                width: string;
                height: string;
                borderRadius: string;
                backgroundColor: string;
                bottom: string;
                left: string;
                transformOrigin: string;
                transform: string;
                transition: string;
            };
            _hover: {
                textDecoration: string;
                _before: {
                    transformOrigin: string;
                    transform: string;
                };
            };
        };
        menu: {
            borderRadius: string;
            _hover: {
                textDecoration: string;
                bg: string;
            };
        };
    } | undefined;
    defaultProps?: {
        size?: string | number | undefined;
        variant?: "underline" | "menu" | undefined;
        colorScheme?: string | undefined;
    } | undefined;
};
export default _default;
