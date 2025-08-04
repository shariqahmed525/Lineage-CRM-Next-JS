import { StyleFunctionProps, PartsStyleInterpolation } from '@chakra-ui/styled-system';
declare const _default: {
    baseStyle?: ((props: StyleFunctionProps) => {
        label: {
            color: string;
            fontWeight: string;
        };
        control: {
            borderWidth: string;
            borderColor: string;
            bg: string;
            _checked: {
                [x: string]: string | {
                    [x: string]: string;
                    color?: undefined;
                    _hover?: undefined;
                } | {
                    [x: string]: string | {
                        [x: string]: string;
                    };
                    color: string;
                    _hover: {
                        [x: string]: string;
                    };
                };
                color: string;
                _hover: {
                    [x: string]: string;
                };
                _dark: {
                    [x: string]: string | {
                        [x: string]: string;
                    };
                    color: string;
                    _hover: {
                        [x: string]: string;
                    };
                };
            };
            _indeterminate: {
                [x: string]: string | {
                    [x: string]: string;
                };
                _dark: {
                    [x: string]: string;
                };
            };
        };
    }) | undefined;
    sizes?: {
        sm: {
            label: {
                fontSize: string;
                lineHeight: string;
            };
            control: {
                borderRadius: string;
            };
            icon: {
                fontSize: string;
            };
        };
        md: {
            label: {
                fontSize: string;
                lineHeight: string;
            };
            control: {
                borderRadius: string;
            };
            icon: {
                fontSize: string;
            };
        };
        lg: {
            label: {
                fontSize: string;
            };
            control: {
                borderRadius: string;
                lineHeight: string;
            };
            icon: {
                fontSize: string;
            };
        };
    } | undefined;
    variants?: {
        [key: string]: PartsStyleInterpolation<{
            keys: ("container" | "icon" | "label" | "control")[];
        }>;
    } | undefined;
    defaultProps?: {
        size?: "sm" | "md" | "lg" | undefined;
        variant?: string | number | undefined;
        colorScheme?: string | undefined;
    } | undefined;
    parts: ("container" | "icon" | "label" | "control")[];
};
export default _default;
