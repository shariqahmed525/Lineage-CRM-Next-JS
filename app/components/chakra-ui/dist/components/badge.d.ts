import { SystemStyleInterpolation, StyleFunctionProps } from '@chakra-ui/styled-system';
declare const _default: {
    baseStyle?: SystemStyleInterpolation | undefined;
    sizes?: {
        sm: {
            textStyle: string;
            px: number;
            py: number;
        };
        md: {
            textStyle: string;
            px: number;
            py: number;
        };
        lg: {
            textStyle: string;
            px: number;
            py: number;
        };
    } | undefined;
    variants?: {
        pill: (props: StyleFunctionProps) => {
            [x: string]: string | {
                [x: string]: string;
            };
            textTransform: string;
            fontWeight: string;
            borderRadius: string;
            _dark: {
                [x: string]: string;
            };
        };
    } | undefined;
    defaultProps?: {
        size?: "sm" | "md" | "lg" | undefined;
        variant?: "pill" | undefined;
        colorScheme?: string | undefined;
    } | undefined;
};
export default _default;
