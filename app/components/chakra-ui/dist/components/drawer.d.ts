import { PartsStyleInterpolation } from '@chakra-ui/styled-system';
declare const _default: {
    baseStyle?: {
        header: {
            px: {
                base: number;
                md: number;
            };
            pt: number;
            pb: number;
            fontSize: string;
            fontWeight: string;
        };
        body: {
            px: {
                base: number;
                md: number;
            };
            py: number;
        };
        footer: {
            px: {
                base: number;
                md: number;
            };
            py: number;
            display: string;
        };
        dialog: {
            bg: string;
            boxShadow: string;
        };
    } | undefined;
    sizes?: {
        [key: string]: PartsStyleInterpolation<{
            keys: ("overlay" | "body" | "dialogContainer" | "dialog" | "header" | "closeButton" | "footer")[];
        }>;
    } | undefined;
    variants?: {
        [key: string]: PartsStyleInterpolation<{
            keys: ("overlay" | "body" | "dialogContainer" | "dialog" | "header" | "closeButton" | "footer")[];
        }>;
    } | undefined;
    defaultProps?: {
        size?: string | number | undefined;
        variant?: string | number | undefined;
        colorScheme?: string | undefined;
    } | undefined;
    parts: ("overlay" | "body" | "dialogContainer" | "dialog" | "header" | "closeButton" | "footer")[];
};
export default _default;
