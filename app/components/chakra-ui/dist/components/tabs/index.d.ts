import { PartsStyleInterpolation, StyleFunctionProps } from '@chakra-ui/styled-system';
declare const _default: {
    baseStyle?: PartsStyleInterpolation<{
        keys: ("tab" | "tabpanel" | "tabpanels" | "root" | "tablist" | "indicator")[];
    }> | undefined;
    sizes?: {
        [key: string]: PartsStyleInterpolation<{
            keys: ("tab" | "tabpanel" | "tabpanels" | "root" | "tablist" | "indicator")[];
        }>;
    } | undefined;
    variants?: {
        underline: (props: StyleFunctionProps) => {
            tablist: {
                gap: string;
                borderColor: string;
            };
            tab: {
                justifyContent: string;
                px: string;
                _selected: {
                    color: string;
                };
                fontSize: string;
                lineHeight: string;
                py: string;
                fontWeight: string;
                color: string;
            } | {
                justifyContent: string;
                px: string;
                _selected: {
                    color: string;
                };
                fontSize: string;
                py: string;
                fontWeight: string;
                color: string;
            };
            indicator: {
                width: string;
                bg: string;
            } | {
                height: string;
                marginTop: number;
                bg: string;
            };
        };
        indicator: (props: StyleFunctionProps) => {
            tablist: {
                borderRadius: string;
                borderWidth: string;
                bg: string;
                px: string;
                gap: string;
                h: string;
            } | {
                borderRadius: string;
                borderWidth: string;
                bg: string;
                px: string;
                gap: string;
                h: string;
            };
            tab: {
                color: string;
                fontWeight: string;
                zIndex: number;
                _selected: {
                    color: string;
                };
                fontSize: string;
                lineHeight: string;
            } | {
                color: string;
                fontWeight: string;
                zIndex: number;
                _selected: {
                    color: string;
                };
                fontSize: string;
            };
            indicator: {
                borderRadius: string;
                boxShadow: string;
                bg: string;
                _dark: {
                    bg: string;
                };
                h: string;
                marginTop: string;
            } | {
                borderRadius: string;
                boxShadow: string;
                bg: string;
                _dark: {
                    bg: string;
                };
                h: string;
                marginTop: string;
            };
        };
    } | undefined;
    defaultProps?: {
        size?: string | number | undefined;
        variant?: "underline" | "indicator" | undefined;
        colorScheme?: string | undefined;
    } | undefined;
    parts: ("tab" | "tabpanel" | "tabpanels" | "root" | "tablist" | "indicator")[];
};
export default _default;
