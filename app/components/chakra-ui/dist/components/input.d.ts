import { StyleFunctionProps } from '@chakra-ui/styled-system';
declare const _default: {
    baseStyle?: {
        field: {
            _disabled: {
                opacity: number;
            };
            _placeholder: {
                opacity: number;
                color: string;
            };
        };
    } | undefined;
    sizes?: {
        sm: {
            field: {
                px: number;
                h: number;
                fontSize: string;
            };
        };
        md: {
            field: {
                px: number;
                h: number;
                fontSize: string;
            };
        };
        lg: {
            field: {
                px: number;
                h: number;
                fontSize: string;
            };
        };
        xl: {
            field: {
                px: number;
                h: number;
                fontSize: string;
            };
        };
    } | undefined;
    variants?: {
        outline: (props: StyleFunctionProps) => {
            field: {
                [x: string]: string | {
                    [x: string]: string;
                    borderColor?: undefined;
                    zIndex?: undefined;
                    boxShadow?: undefined;
                    _dark?: undefined;
                } | {
                    borderColor: string;
                    zIndex?: undefined;
                    boxShadow?: undefined;
                    _dark?: undefined;
                } | {
                    zIndex: number;
                    borderColor: string;
                    boxShadow: string;
                    _dark: {
                        borderColor: string;
                        boxShadow: string;
                    };
                };
                borderRadius: string;
                borderColor: string;
                bg: string;
                _dark: {
                    [x: string]: string;
                };
                _hover: {
                    borderColor: string;
                };
                _focusVisible: {
                    zIndex: number;
                    borderColor: string;
                    boxShadow: string;
                    _dark: {
                        borderColor: string;
                        boxShadow: string;
                    };
                };
            };
            addon: {
                borderRadius: string;
                borderColor: string;
                bg: string;
            };
        };
        'filled.accent': {
            field: {
                bg: string;
                borderWidth: string;
                borderColor: string;
                borderRadius: string;
                color: string;
                _placeholder: {
                    color: string;
                };
                _hover: {
                    borderColor: string;
                };
                _focusVisible: {
                    borderColor: string;
                };
            };
        };
    } | undefined;
    defaultProps?: {
        size?: "sm" | "md" | "lg" | "xl" | undefined;
        variant?: "outline" | "filled.accent" | undefined;
        colorScheme?: string | undefined;
    } | undefined;
    parts: ("element" | "field" | "addon")[];
};
export default _default;
